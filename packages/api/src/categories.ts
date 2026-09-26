import { z } from 'zod';
import { groupSlugInputSchema } from './membership';

/** Max categories per group (enforced in category.create). */
export const CATEGORY_MAX_PER_GROUP = 10;

export const CATEGORY_NAME_MAX_LENGTH = 100;

/** Default / only v1 permission value (ACL deferred). */
export const CATEGORY_PERMISSIONS_ALL_MEMBERS = 'all_members' as const;

export const categoryPermissionsSchema = z.literal(
    CATEGORY_PERMISSIONS_ALL_MEMBERS,
);

export const categoryNameSchema = z
    .string()
    .trim()
    .min(1)
    .max(CATEGORY_NAME_MAX_LENGTH);

export const categorySchema = z.object({
    id: z.string(),
    groupId: z.string(),
    name: z.string(),
    sortOrder: z.number().int(),
    permissions: categoryPermissionsSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const categoryListInputSchema = groupSlugInputSchema;

export const categoryCreateInputSchema = groupSlugInputSchema.extend({
    name: categoryNameSchema,
});

export const categoryUpdateInputSchema = groupSlugInputSchema.extend({
    categoryId: z.string().min(1),
    name: categoryNameSchema,
});

export const categoryDeleteInputSchema = groupSlugInputSchema.extend({
    categoryId: z.string().min(1),
});

/** Full ordered id list for the group; must match exactly the current set. */
export const categoryReorderInputSchema = groupSlugInputSchema.extend({
    orderedIds: z.array(z.string().min(1)).min(1).max(CATEGORY_MAX_PER_GROUP),
});

export type CategoryDto = z.infer<typeof categorySchema>;
export type CategoryListInput = z.infer<typeof categoryListInputSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateInputSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateInputSchema>;
export type CategoryDeleteInput = z.infer<typeof categoryDeleteInputSchema>;
export type CategoryReorderInput = z.infer<typeof categoryReorderInputSchema>;

export function serializeCategory(category: {
    id: string;
    groupId: string;
    name: string;
    sortOrder: number;
    permissions: string;
    createdAt: Date;
    updatedAt: Date;
}): CategoryDto {
    return {
        id: category.id,
        groupId: category.groupId,
        name: category.name,
        sortOrder: category.sortOrder,
        permissions: categoryPermissionsSchema.parse(category.permissions),
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
    };
}

/**
 * Case-insensitive key for uniqueness.
 * Matches Postgres `lower()` for Latin; Unicode edge cases deferred.
 */
export function normalizeCategoryName(name: string) {
    return name.trim().toLowerCase();
}
