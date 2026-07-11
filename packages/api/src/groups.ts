import { z } from 'zod';

export const groupVisibilitySchema = z.enum(['public', 'private', 'hidden']);

export const groupMembershipRoleSchema = z.enum([
    'owner',
    'admin',
    'moderator',
    'member',
]);

export const groupSlugSchema = z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

export const groupSchema = z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    logoUrl: z.string().nullable(),
    coverUrl: z.string().nullable(),
    ownerId: z.string(),
    visibility: groupVisibilitySchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const groupWithRoleSchema = groupSchema.extend({
    role: groupMembershipRoleSchema,
});

export const createGroupInputSchema = z.object({
    name: z.string().min(1).max(255),
    slug: groupSlugSchema,
    description: z.string().max(5000).optional(),
    visibility: groupVisibilitySchema.optional(),
});

export const getGroupBySlugInputSchema = z.object({
    slug: z.string().min(1),
});

export type GroupDto = z.infer<typeof groupSchema>;
export type GroupWithRoleDto = z.infer<typeof groupWithRoleSchema>;
export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;
export type GroupVisibilityDto = z.infer<typeof groupVisibilitySchema>;
export type GroupMembershipRoleDto = z.infer<typeof groupMembershipRoleSchema>;

export function serializeGroup(group: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    ownerId: string;
    visibility: 'public' | 'private' | 'hidden';
    createdAt: Date;
    updatedAt: Date;
}): GroupDto {
    return {
        id: group.id,
        slug: group.slug,
        name: group.name,
        description: group.description,
        logoUrl: group.logoUrl,
        coverUrl: group.coverUrl,
        ownerId: group.ownerId,
        visibility: group.visibility,
        createdAt: group.createdAt.toISOString(),
        updatedAt: group.updatedAt.toISOString(),
    };
}
