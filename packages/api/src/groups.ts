import { z } from 'zod';

/** Single source of truth for group visibility values (Prisma + API). */
export const GROUP_VISIBILITIES = ['public', 'private', 'hidden'] as const;

/** Single source of truth for group membership roles (Prisma + API). */
export const GROUP_MEMBERSHIP_ROLES = [
    'owner',
    'admin',
    'moderator',
    'member',
] as const;

/** Roles that can moderate group content (pin, moderate deletes, etc.). */
export const GROUP_MODERATOR_ROLES = [
    'moderator',
    'admin',
    'owner',
] as const satisfies ReadonlyArray<(typeof GROUP_MEMBERSHIP_ROLES)[number]>;

/** Roles with group admin capabilities (settings, categories, reports, pending). */
export const GROUP_ADMIN_ROLES = [
    'admin',
    'owner',
] as const satisfies ReadonlyArray<(typeof GROUP_MEMBERSHIP_ROLES)[number]>;

/** Single source of truth for group membership statuses (Prisma + API). */
export const GROUP_MEMBERSHIP_STATUSES = [
    'active',
    'pending',
    'banned',
] as const;

export const groupVisibilitySchema = z.enum(GROUP_VISIBILITIES);

export const groupMembershipRoleSchema = z.enum(GROUP_MEMBERSHIP_ROLES);

export const groupMembershipStatusSchema = z.enum(GROUP_MEMBERSHIP_STATUSES);

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

export const groupPublicSchema = z.object({
    group: groupSchema,
    memberCount: z.number().int().nonnegative(),
    viewerMembership: z
        .object({
            id: z.string(),
            groupId: z.string(),
            userId: z.string(),
            role: groupMembershipRoleSchema,
            status: groupMembershipStatusSchema,
            points: z.number().int(),
            level: z.number().int(),
            joinedAt: z.string(),
        })
        .nullable(),
});

export type GroupDto = z.infer<typeof groupSchema>;
export type GroupWithRoleDto = z.infer<typeof groupWithRoleSchema>;
export type GroupPublicDto = z.infer<typeof groupPublicSchema>;
export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;
export type GroupVisibilityDto = (typeof GROUP_VISIBILITIES)[number];
export type GroupMembershipRoleDto = (typeof GROUP_MEMBERSHIP_ROLES)[number];
export type GroupMembershipStatusDto =
    (typeof GROUP_MEMBERSHIP_STATUSES)[number];
export type GroupModeratorRoleDto = (typeof GROUP_MODERATOR_ROLES)[number];
export type GroupAdminRoleDto = (typeof GROUP_ADMIN_ROLES)[number];

export function isGroupModeratorRole(
    role: string | null | undefined,
): role is GroupModeratorRoleDto {
    return (
        role != null &&
        (GROUP_MODERATOR_ROLES as readonly string[]).includes(role)
    );
}

export function isGroupAdminRole(
    role: string | null | undefined,
): role is GroupAdminRoleDto {
    return (
        role != null && (GROUP_ADMIN_ROLES as readonly string[]).includes(role)
    );
}

export function serializeGroup(group: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    ownerId: string;
    visibility: GroupVisibilityDto;
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
