import { z } from 'zod';
import {
    groupSlugInputSchema,
    membershipUserSummarySchema,
    serializeMembershipUserSummary,
} from './membership';
import { postBodySchema } from './posts';

/** Comment body shares the same length bounds as post body for now. */
export const commentBodySchema = postBodySchema;

export const commentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    parentId: z.string().nullable(),
    authorId: z.string(),
    body: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    author: membershipUserSummarySchema.optional(),
});

export const commentListInputSchema = groupSlugInputSchema.extend({
    postId: z.string().min(1),
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(50),
});

export const commentListPageSchema = z.object({
    items: z.array(commentSchema),
    nextCursor: z.string().nullable(),
});

export const commentCreateInputSchema = groupSlugInputSchema.extend({
    postId: z.string().min(1),
    body: commentBodySchema,
    parentId: z.string().min(1).optional(),
});

export const commentGetInputSchema = groupSlugInputSchema.extend({
    commentId: z.string().min(1),
});

export const commentUpdateInputSchema = commentGetInputSchema.extend({
    body: commentBodySchema,
});

export type CommentDto = z.infer<typeof commentSchema>;
export type CommentListInput = z.infer<typeof commentListInputSchema>;
export type CommentListPageDto = z.infer<typeof commentListPageSchema>;
export type CommentCreateInput = z.infer<typeof commentCreateInputSchema>;
export type CommentGetInput = z.infer<typeof commentGetInputSchema>;
export type CommentUpdateInput = z.infer<typeof commentUpdateInputSchema>;

export function serializeComment(comment: {
    id: string;
    postId: string;
    parentId: string | null;
    authorId: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    author?: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
}): CommentDto {
    return {
        id: comment.id,
        postId: comment.postId,
        parentId: comment.parentId,
        authorId: comment.authorId,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        ...(comment.author
            ? { author: serializeMembershipUserSummary(comment.author) }
            : {}),
    };
}
