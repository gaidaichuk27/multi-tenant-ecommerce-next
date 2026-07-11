import { cache } from 'react';
import { caller } from '@TRPC/server';

export const getGroupBySlug = cache(async (slug: string) => {
    return caller.group.getBySlug({ slug });
});
