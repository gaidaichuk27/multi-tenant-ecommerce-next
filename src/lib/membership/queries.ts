import { cache } from 'react';
import { caller } from '@TRPC/server';

export const listGroupMembers = cache(
    async (slug: string, opts?: { cursor?: string; limit?: number }) => {
        return caller.membership.listMembers({
            slug,
            cursor: opts?.cursor,
            limit: opts?.limit ?? 20,
        });
    },
);

export const listPendingMembers = cache(
    async (slug: string, opts?: { cursor?: string; limit?: number }) => {
        return caller.membership.listPending({
            slug,
            cursor: opts?.cursor,
            limit: opts?.limit ?? 20,
        });
    },
);
