import { z } from 'zod';
import {
    groupSlugInputSchema,
    membershipUserSummarySchema,
    serializeMembershipUserSummary,
} from './membership';

/** Single source of truth for post types (Prisma + API). */
export const POST_TYPES = ['text'] as const;

export const postTypeSchema = z.enum(POST_TYPES);

export const postBodySchema = z.string().trim().min(1).max(20_000);

export const postSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    authorId: z.string(),
    body: z.string(),
    type: postTypeSchema,
    pinned: z.boolean(),
    broadcastEmail: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    author: membershipUserSummarySchema.optional(),
    commentCount: z.number().int().nonnegative().optional(),
});

export const postListInputSchema = groupSlugInputSchema.extend({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(20),
});

export const postListPageSchema = z.object({
    items: z.array(postSchema),
    nextCursor: z.string().nullable(),
});

export const postCreateInputSchema = groupSlugInputSchema.extend({
    body: postBodySchema,
});

export const postGetInputSchema = groupSlugInputSchema.extend({
    postId: z.string().min(1),
});

export const postUpdateInputSchema = postGetInputSchema.extend({
    body: postBodySchema,
});

export type PostTypeDto = (typeof POST_TYPES)[number];
export type PostDto = z.infer<typeof postSchema>;
export type PostListInput = z.infer<typeof postListInputSchema>;
export type PostListPageDto = z.infer<typeof postListPageSchema>;
export type PostCreateInput = z.infer<typeof postCreateInputSchema>;
export type PostGetInput = z.infer<typeof postGetInputSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateInputSchema>;

export function serializePost(post: {
    id: string;
    groupId: string;
    authorId: string;
    body: string;
    type: PostTypeDto;
    pinned: boolean;
    broadcastEmail: boolean;
    createdAt: Date;
    updatedAt: Date;
    author?: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
    commentCount?: number;
}): PostDto {
    return {
        id: post.id,
        groupId: post.groupId,
        authorId: post.authorId,
        body: post.body,
        type: post.type,
        pinned: post.pinned,
        broadcastEmail: post.broadcastEmail,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        ...(post.author
            ? { author: serializeMembershipUserSummary(post.author) }
            : {}),
        ...(typeof post.commentCount === 'number'
            ? { commentCount: post.commentCount }
            : {}),
    };
}
