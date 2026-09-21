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
    likeCount: z.number().int().nonnegative().optional(),
    likedByViewer: z.boolean().optional(),
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

/** Result of `post.like` toggle. */
export const postLikeResultSchema = z.object({
    liked: z.boolean(),
    likeCount: z.number().int().nonnegative(),
});

/** Result of `post.pin` toggle. */
export const postPinResultSchema = z.object({
    pinned: z.boolean(),
});

export type PostTypeDto = (typeof POST_TYPES)[number];
export type PostDto = z.infer<typeof postSchema>;
export type PostListInput = z.infer<typeof postListInputSchema>;
export type PostListPageDto = z.infer<typeof postListPageSchema>;
export type PostCreateInput = z.infer<typeof postCreateInputSchema>;
export type PostGetInput = z.infer<typeof postGetInputSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateInputSchema>;
export type PostLikeResultDto = z.infer<typeof postLikeResultSchema>;
export type PostPinResultDto = z.infer<typeof postPinResultSchema>;

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
    likeCount?: number;
    likedByViewer?: boolean;
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
        ...(typeof post.likeCount === 'number'
            ? { likeCount: post.likeCount }
            : {}),
        ...(typeof post.likedByViewer === 'boolean'
            ? { likedByViewer: post.likedByViewer }
            : {}),
    };
}
