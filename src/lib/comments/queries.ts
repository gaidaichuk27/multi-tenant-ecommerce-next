import { cache } from 'react';
import { caller } from '@TRPC/server';

export const listPostComments = cache(
    async (
        slug: string,
        postId: string,
        opts?: { cursor?: string; limit?: number },
    ) => {
        return caller.comment.list({
            slug,
            postId,
            cursor: opts?.cursor,
            limit: opts?.limit ?? 50,
        });
    },
);

export const getPostComment = cache(async (slug: string, commentId: string) => {
    return caller.comment.get({ slug, commentId });
});
