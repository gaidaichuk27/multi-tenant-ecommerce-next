import { cache } from 'react';
import { caller } from '@TRPC/server';

export const listGroupPosts = cache(
    async (
        slug: string,
        opts?: { cursor?: string; limit?: number; categoryId?: string },
    ) => {
        return caller.post.list({
            slug,
            cursor: opts?.cursor,
            limit: opts?.limit ?? 20,
            ...(opts?.categoryId ? { categoryId: opts.categoryId } : {}),
        });
    },
);

export const getGroupPost = cache(async (slug: string, postId: string) => {
    return caller.post.get({ slug, postId });
});

export const listPostReports = cache(
    async (
        slug: string,
        opts?: {
            cursor?: string;
            limit?: number;
            status?: 'open' | 'resolved' | 'dismissed';
        },
    ) => {
        return caller.post.listReports({
            slug,
            cursor: opts?.cursor,
            limit: opts?.limit ?? 20,
            status: opts?.status ?? 'open',
        });
    },
);
