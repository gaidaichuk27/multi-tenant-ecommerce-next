import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import {
    POST_T_MESSAGES,
    postCreateInputSchema,
    postGetInputSchema,
    postListInputSchema,
    postUpdateInputSchema,
    serializePost,
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

async function findPostInGroupOrThrow(groupId: string, postId: string) {
    const post = await db.post.findFirst({
        where: { id: postId, groupId },
        include: {
            author: { select: AUTHOR_SELECT },
            _count: { select: { comments: true } },
        },
    });

    if (!post) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: POST_T_MESSAGES.NOT_FOUND,
        });
    }

    return post;
}

export const postRouter = createTRPCRouter({
    list: groupMemberProcedure
        .input(postListInputSchema)
        .query(async ({ ctx, input }) => {
            const limit = input.limit;
            const rows = await db.post.findMany({
                where: { groupId: ctx.group.id },
                include: {
                    author: { select: AUTHOR_SELECT },
                    _count: { select: { comments: true } },
                },
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
                items: page.map((row) =>
                    serializePost({
                        ...row,
                        commentCount: row._count.comments,
                    }),
                ),
                nextCursor,
            };
        }),

    get: groupMemberProcedure
        .input(postGetInputSchema)
        .query(async ({ ctx, input }) => {
            const post = await findPostInGroupOrThrow(
                ctx.group.id,
                input.postId,
            );

            return serializePost({
                ...post,
                commentCount: post._count.comments,
            });
        }),

    create: groupMemberProcedure
        .input(postCreateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const post = await db.post.create({
                data: {
                    groupId: ctx.group.id,
                    authorId: ctx.userId,
                    body: input.body,
                    type: 'text',
                },
                include: {
                    author: { select: AUTHOR_SELECT },
                    _count: { select: { comments: true } },
                },
            });

            return serializePost({
                ...post,
                commentCount: post._count.comments,
            });
        }),

    update: groupMemberProcedure
        .input(postUpdateInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await findPostInGroupOrThrow(
                ctx.group.id,
                input.postId,
            );

            const isAuthor = existing.authorId === ctx.userId;
            if (!isAuthor && !canModerate(ctx.membership.role)) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: POST_T_MESSAGES.FORBIDDEN,
                });
            }

            const post = await db.post.update({
                where: { id: existing.id },
                data: { body: input.body },
                include: {
                    author: { select: AUTHOR_SELECT },
                    _count: { select: { comments: true } },
                },
            });

            return serializePost({
                ...post,
                commentCount: post._count.comments,
            });
        }),

    delete: groupMemberProcedure
        .input(postGetInputSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await findPostInGroupOrThrow(
                ctx.group.id,
                input.postId,
            );

            const isAuthor = existing.authorId === ctx.userId;
            if (!isAuthor && !canModerate(ctx.membership.role)) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: POST_T_MESSAGES.FORBIDDEN,
                });
            }

            await db.post.delete({ where: { id: existing.id } });

            return { success: true as const };
        }),
});
