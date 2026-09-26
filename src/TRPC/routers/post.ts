import { TRPCError } from '@trpc/server';
import {
    db,
    isPrismaForeignKeyErrorOnField,
    isPrismaUniqueConstraintError,
    type Prisma,
} from '@repo/database';
import {
    CATEGORY_T_MESSAGES,
    POST_T_MESSAGES,
    isGroupModeratorRole,
    postCreateInputSchema,
    postGetInputSchema,
    postListInputSchema,
    postListReportsInputSchema,
    postReportInputSchema,
    postResolveReportInputSchema,
    postUpdateInputSchema,
    serializePost,
    serializePostReport,
} from '@repo/api';
import {
    createTRPCRouter,
    groupAdminProcedure,
    groupMemberProcedure,
    groupModeratorProcedure,
} from '../init';

const AUTHOR_SELECT = {
    id: true,
    username: true,
    name: true,
    avatarUrl: true,
} as const;

const REPORT_INCLUDE = {
    reporter: { select: AUTHOR_SELECT },
    resolver: { select: AUTHOR_SELECT },
    post: {
        select: {
            id: true,
            body: true,
            authorId: true,
            createdAt: true,
            author: { select: AUTHOR_SELECT },
        },
    },
} as const;

/** Points awarded to the post author when someone else likes their post. */
const LIKE_AUTHOR_POINTS = 1;

function postIncludeForViewer(userId: string) {
    return {
        author: { select: AUTHOR_SELECT },
        _count: { select: { comments: true, likes: true } },
        likes: {
            where: { userId },
            select: { id: true },
            take: 1,
        },
    } as const;
}

function serializePostRow(row: {
    id: string;
    groupId: string;
    authorId: string;
    categoryId: string | null;
    body: string;
    type: 'text';
    pinned: boolean;
    broadcastEmail: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    };
    _count: { comments: number; likes: number };
    likes: { id: string }[];
}) {
    return serializePost({
        ...row,
        commentCount: row._count.comments,
        likeCount: row._count.likes,
        likedByViewer: row.likes.length > 0,
    });
}

async function assertCategoryInGroup(groupId: string, categoryId: string) {
    const category = await db.category.findFirst({
        where: { id: categoryId, groupId },
        select: { id: true },
    });

    if (!category) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: CATEGORY_T_MESSAGES.NOT_FOUND,
        });
    }
}

async function findPostInGroupOrThrow(
    groupId: string,
    postId: string,
    userId: string,
) {
    const post = await db.post.findFirst({
        where: { id: postId, groupId },
        include: postIncludeForViewer(userId),
    });

    if (!post) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: POST_T_MESSAGES.NOT_FOUND,
        });
    }

    return post;
}

/**
 * Adjust author membership points. Only touches active memberships.
 * Decrements use GREATEST(0, points - n) so concurrent unlikes cannot
 * overwrite each other or drive points negative.
 */
async function adjustAuthorPoints(
    tx: Prisma.TransactionClient,
    groupId: string,
    authorId: string,
    delta: number,
) {
    if (delta === 0) return;

    if (delta > 0) {
        await tx.groupMembership.updateMany({
            where: { groupId, userId: authorId, status: 'active' },
            data: { points: { increment: delta } },
        });
        return;
    }

    await clawBackAuthorPoints(tx, groupId, authorId, Math.abs(delta));
}

/** Floor author points after removing likes (unlike or post delete). */
async function clawBackAuthorPoints(
    tx: Prisma.TransactionClient,
    groupId: string,
    authorId: string,
    amount: number,
) {
    if (amount <= 0) return;

    await tx.$executeRaw`
        UPDATE "group_memberships"
        SET "points" = GREATEST(0, "points" - ${amount})
        WHERE "group_id" = ${groupId}
          AND "user_id" = ${authorId}
          AND "status" = 'active'
    `;
}

export const postRouter = createTRPCRouter({
    list: groupMemberProcedure
        .input(postListInputSchema)
        .query(async ({ ctx, input }) => {
            if (input.categoryId) {
                await assertCategoryInGroup(ctx.group.id, input.categoryId);
            }

            const limit = input.limit;
            const rows = await db.post.findMany({
                where: {
                    groupId: ctx.group.id,
                    ...(input.categoryId
                        ? { categoryId: input.categoryId }
                        : {}),
                },
                include: postIncludeForViewer(ctx.userId),
                orderBy: [
                    { pinned: 'desc' },
                    { createdAt: 'desc' },
                    { id: 'desc' },
                ],
                take: limit + 1,
                ...(input.cursor
                    ? {
                          cursor: { id: input.cursor },
                          skip: 1,
                      }
                    : {}),
            });

            const page = rows.length > limit ? rows.slice(0, limit) : rows;
            const nextCursor =
                rows.length > limit
                    ? (page[page.length - 1]?.id ?? null)
                    : null;

            return {
                items: page.map(serializePostRow),
                nextCursor,
            };
        }),

    get: groupMemberProcedure
        .input(postGetInputSchema)
        .query(async ({ ctx, input }) => {
            const post = await findPostInGroupOrThrow(
                ctx.group.id,
                input.postId,
                ctx.userId,
            );

            return serializePostRow(post);
        }),

    create: groupMemberProcedure
        .input(postCreateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const categoryId = input.categoryId ?? null;

            if (categoryId) {
                await assertCategoryInGroup(ctx.group.id, categoryId);
            }

            try {
                const post = await db.post.create({
                    data: {
                        groupId: ctx.group.id,
                        authorId: ctx.userId,
                        body: input.body,
                        type: 'text',
                        categoryId,
                    },
                    include: postIncludeForViewer(ctx.userId),
                });

                return serializePostRow(post);
            } catch (error) {
                // Category deleted between assert and write → FK P2003 on categoryId.
                if (
                    categoryId &&
                    isPrismaForeignKeyErrorOnField(error, 'categoryId')
                ) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: CATEGORY_T_MESSAGES.NOT_FOUND,
                    });
                }
                throw error;
            }
        }),

    update: groupMemberProcedure
        .input(postUpdateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await findPostInGroupOrThrow(
                ctx.group.id,
                input.postId,
                ctx.userId,
            );

            const isAuthor = existing.authorId === ctx.userId;
            if (!isAuthor && !isGroupModeratorRole(ctx.membership.role)) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: POST_T_MESSAGES.FORBIDDEN,
                });
            }

            const nextCategoryId =
                input.categoryId === undefined
                    ? undefined
                    : (input.categoryId ?? null);

            if (nextCategoryId) {
                await assertCategoryInGroup(ctx.group.id, nextCategoryId);
            }

            try {
                const post = await db.post.update({
                    where: { id: existing.id },
                    data: {
                        body: input.body,
                        ...(nextCategoryId !== undefined
                            ? { categoryId: nextCategoryId }
                            : {}),
                    },
                    include: postIncludeForViewer(ctx.userId),
                });

                return serializePostRow(post);
            } catch (error) {
                // Category deleted between assert and write → FK P2003 on categoryId.
                if (
                    nextCategoryId &&
                    isPrismaForeignKeyErrorOnField(error, 'categoryId')
                ) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: CATEGORY_T_MESSAGES.NOT_FOUND,
                    });
                }
                throw error;
            }
        }),

    delete: groupMemberProcedure
        .input(postGetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await findPostInGroupOrThrow(
                ctx.group.id,
                input.postId,
                ctx.userId,
            );

            const isAuthor = existing.authorId === ctx.userId;
            if (!isAuthor && !isGroupModeratorRole(ctx.membership.role)) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: POST_T_MESSAGES.FORBIDDEN,
                });
            }

            await db.$transaction(async (tx) => {
                // Non-self likes awarded +1 each; claw back before cascade deletes likes.
                const awardedLikeCount = await tx.postLike.count({
                    where: {
                        postId: existing.id,
                        userId: { not: existing.authorId },
                    },
                });

                if (awardedLikeCount > 0) {
                    await clawBackAuthorPoints(
                        tx,
                        ctx.group.id,
                        existing.authorId,
                        awardedLikeCount * LIKE_AUTHOR_POINTS,
                    );
                }

                await tx.post.delete({ where: { id: existing.id } });
            });

            return { success: true as const };
        }),

    /**
     * Atomic pin toggle (NOT pinned in SQL) so concurrent mod clicks cannot both
     * read false and both write true — last-write-wins race on a blind read/update.
     * Moderators, admins, and owners only.
     */
    pin: groupModeratorProcedure
        .input(postGetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const rows = await db.$queryRaw<{ pinned: boolean }[]>`
                UPDATE "posts"
                SET "pinned" = NOT "pinned",
                    "updated_at" = CURRENT_TIMESTAMP
                WHERE "id" = ${input.postId}
                  AND "group_id" = ${ctx.group.id}
                RETURNING "pinned"
            `;

            const row = rows[0];
            if (!row) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: POST_T_MESSAGES.NOT_FOUND,
                });
            }

            return { pinned: row.pinned };
        }),

    /**
     * Idempotent toggle: like if absent, unlike if present.
     * Awards +1 author membership points on like (not self-likes); floors at 0 on unlike.
     * Like row mutate + points adjust run in one transaction; points only move when the
     * like row is actually created/deleted (avoids farming / double-award under races).
     */
    like: groupMemberProcedure
        .input(postGetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const post = await db.post.findFirst({
                where: { id: input.postId, groupId: ctx.group.id },
                select: { id: true, authorId: true },
            });

            if (!post) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: POST_T_MESSAGES.NOT_FOUND,
                });
            }

            const awardPoints = post.authorId !== ctx.userId;

            const liked = await db.$transaction(async (tx) => {
                const existing = await tx.postLike.findUnique({
                    where: {
                        postId_userId: {
                            postId: post.id,
                            userId: ctx.userId,
                        },
                    },
                    select: { id: true },
                });

                if (existing) {
                    const deleted = await tx.postLike.deleteMany({
                        where: {
                            postId: post.id,
                            userId: ctx.userId,
                        },
                    });

                    // Concurrent unlike already removed the row — no points change.
                    if (deleted.count > 0 && awardPoints) {
                        await adjustAuthorPoints(
                            tx,
                            ctx.group.id,
                            post.authorId,
                            -LIKE_AUTHOR_POINTS,
                        );
                    }

                    return false;
                }

                // skipDuplicates: unique races must not abort the interactive tx (P2002).
                const created = await tx.postLike.createMany({
                    data: [{ postId: post.id, userId: ctx.userId }],
                    skipDuplicates: true,
                });

                if (created.count === 0) {
                    return true;
                }

                if (awardPoints) {
                    await adjustAuthorPoints(
                        tx,
                        ctx.group.id,
                        post.authorId,
                        LIKE_AUTHOR_POINTS,
                    );
                }

                return true;
            });

            const likeCount = await db.postLike.count({
                where: { postId: post.id },
            });

            return { liked, likeCount };
        }),

    /**
     * Active members can report another member's post (not their own).
     * One open report per reporter per post; re-report allowed after resolve/dismiss.
     */
    report: groupMemberProcedure
        .input(postReportInputSchema)
        .mutation(async ({ ctx, input }) => {
            const post = await db.post.findFirst({
                where: { id: input.postId, groupId: ctx.group.id },
                select: { id: true, authorId: true },
            });

            if (!post) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: POST_T_MESSAGES.NOT_FOUND,
                });
            }

            if (post.authorId === ctx.userId) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: POST_T_MESSAGES.REPORT_OWN_FORBIDDEN,
                });
            }

            const openExisting = await db.postReport.findFirst({
                where: {
                    postId: post.id,
                    reporterId: ctx.userId,
                    status: 'open',
                },
                select: { id: true },
            });

            if (openExisting) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: POST_T_MESSAGES.REPORT_ALREADY_OPEN,
                });
            }

            const reason = input.reason?.trim() || null;

            try {
                const report = await db.postReport.create({
                    data: {
                        postId: post.id,
                        groupId: ctx.group.id,
                        reporterId: ctx.userId,
                        reason,
                        status: 'open',
                    },
                    include: REPORT_INCLUDE,
                });

                return serializePostReport(report);
            } catch (error) {
                // Race on partial unique (open report) — treat as already reported.
                if (isPrismaUniqueConstraintError(error)) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: POST_T_MESSAGES.REPORT_ALREADY_OPEN,
                    });
                }
                throw error;
            }
        }),

    /**
     * Admin/owner moderation queue (same gate as Pending members — not moderators).
     * Defaults to open reports; pass status to filter.
     */
    listReports: groupAdminProcedure
        .input(postListReportsInputSchema)
        .query(async ({ ctx, input }) => {
            const limit = input.limit;
            const rows = await db.postReport.findMany({
                where: {
                    groupId: ctx.group.id,
                    status: input.status,
                },
                include: REPORT_INCLUDE,
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
                take: limit + 1,
                ...(input.cursor
                    ? {
                          cursor: { id: input.cursor },
                          skip: 1,
                      }
                    : {}),
            });

            const page = rows.length > limit ? rows.slice(0, limit) : rows;
            const nextCursor =
                rows.length > limit
                    ? (page[page.length - 1]?.id ?? null)
                    : null;

            return {
                items: page.map(serializePostReport),
                nextCursor,
            };
        }),

    /**
     * Admin/owner resolve or dismiss an open report.
     */
    resolveReport: groupAdminProcedure
        .input(postResolveReportInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await db.postReport.findFirst({
                where: {
                    id: input.reportId,
                    groupId: ctx.group.id,
                },
                select: { id: true, status: true },
            });

            if (!existing) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: POST_T_MESSAGES.REPORT_NOT_FOUND,
                });
            }

            if (existing.status !== 'open') {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: POST_T_MESSAGES.REPORT_ALREADY_CLOSED,
                });
            }

            const note = input.note?.trim() || null;

            const report = await db.postReport.update({
                where: { id: existing.id },
                data: {
                    status: input.action,
                    resolverId: ctx.userId,
                    resolveNote: note,
                    resolvedAt: new Date(),
                },
                include: REPORT_INCLUDE,
            });

            return serializePostReport(report);
        }),
});
