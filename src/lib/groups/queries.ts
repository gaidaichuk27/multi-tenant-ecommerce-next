import { cache } from 'react';
import { caller } from '@TRPC/server';

export const getGroupBySlug = cache(async (slug: string) => {
    return caller.group.getBySlug({ slug });
});

export const getGroupPublic = cache(async (slug: string) => {
    return caller.group.getPublic({ slug });
});

export const getMineMembership = cache(async (slug: string) => {
    return caller.group.getMineMembership({ slug });
});
