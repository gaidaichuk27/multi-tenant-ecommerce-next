import { cache } from 'react';
import { caller } from '@TRPC/server';

export const listCategories = cache(async (slug: string) => {
    return caller.category.list({ slug });
});
