import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import {
    COMMENT_T_MESSAGES,
    commentCreateInputSchema,
    commentGetInputSchema,
    commentListInputSchema,
    commentUpdateInputSchema,
    serializeComment,
} from '@repo/api';
import { createTRPCRouter, groupMemberProcedure } from '../init';

const AUTHOR_SELECT = {
    id: true,
    username: true,
    name: true,
    avatarUrl: true,
} as const;

const MODERATOR_ROLES = new Set(['moderator', 'admin', 'owner']);

function canModerate(role: string) {
    return MODERATOR_ROLES.has(role);
}

async function assertPostInGroup(groupId: string, postId: string) {
    const post = await db.post.findFirst({
        where: { id: postId, groupId },
        select: { id: true },
    });

    if (!post) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: COMMENT_T_MESSAGES.POST_NOT_FOUND,
        });
    }

    return post;
}

async function findCommentInGroupOrThrow(groupId: string, commentId: string) {
    const comment = await db.comment.findFirst({
        where: {
            id: commentId,
            post: { groupId },
        },
        include: {
            author: { select: AUTHOR_SELECT },
        },
    });

    if (!comment) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: COMMENT_T_MESSAGES.NOT_FOUND,
        });
    }

    return comment;
}

export const commentRouter = createTRPCRouter({
    list: groupMemberProcedure
        .input(commentListInputSchema)
        .query(async ({ ctx, input }) => {
            await assertPostInGroup(ctx.group.id, input.postId);

            const limit = input.limit;
            const rows = await db.comment.findMany({
                where: { postId: input.postId },
                include: { author: { select: AUTHOR_SELECT } },
                orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
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
                items: page.map((row) => serializeComment(row)),
                nextCursor,
            };
        }),

    get: groupMemberProcedure
        .input(commentGetInputSchema)
        .query(async ({ ctx, input }) => {
            const comment = await findCommentInGroupOrThrow(
                ctx.group.id,
                input.commentId,
            );

            return serializeComment(comment);
        }),

    create: groupMemberProcedure
        .input(commentCreateInputSchema)
        .mutation(async ({ ctx, input }) => {
            await assertPostInGroup(ctx.group.id, input.postId);

            if (input.parentId) {
                const parent = await db.comment.findFirst({
                    where: {
                        id: input.parentId,
                        postId: input.postId,
                    },
                    select: { id: true },
                });

                if (!parent) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: COMMENT_T_MESSAGES.PARENT_NOT_FOUND,
                    });
                }
            }

            const comment = await db.comment.create({
                data: {
                    postId: input.postId,
                    parentId: input.parentId,
                    authorId: ctx.userId,
                    body: input.body,
                },
                include: { author: { select: AUTHOR_SELECT } },
            });

            return serializeComment(comment);
        }),

    update: groupMemberProcedure
        .input(commentUpdateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await findCommentInGroupOrThrow(
                ctx.group.id,
                input.commentId,
            );

            const isAuthor = existing.authorId === ctx.userId;
            if (!isAuthor && !canModerate(ctx.membership.role)) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: COMMENT_T_MESSAGES.FORBIDDEN,
                });
            }

            const comment = await db.comment.update({
                where: { id: existing.id },
                data: { body: input.body },
                include: { author: { select: AUTHOR_SELECT } },
            });

            return serializeComment(comment);
        }),

    delete: groupMemberProcedure
        .input(commentGetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await findCommentInGroupOrThrow(
                ctx.group.id,
                input.commentId,
            );

            const isAuthor = existing.authorId === ctx.userId;
            if (!isAuthor && !canModerate(ctx.membership.role)) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: COMMENT_T_MESSAGES.FORBIDDEN,
                });
            }

            await db.comment.delete({ where: { id: existing.id } });

            return { success: true as const };
        }),
});
