import { z } from 'zod';
import {
    groupMembershipRoleSchema,
    groupMembershipStatusSchema,
    groupSlugSchema,
    type GroupMembershipRoleDto,
    type GroupMembershipStatusDto,
} from './groups';
import { storefrontLocaleSchema } from './locales';

export { storefrontLocaleSchema } from './locales';

/** Shared slug input for all group-scoped procedures. Never accept bare groupId from the client. */
export const groupSlugInputSchema = z.object({
    slug: z.string().min(1),
});

/** Locale only on mutations that send membership mail. */
export const membershipMailLocaleSchema = z.object({
    locale: storefrontLocaleSchema.optional(),
});

export const membershipRequestJoinInputSchema = groupSlugInputSchema.merge(
    membershipMailLocaleSchema,
);

export const membershipUserSummarySchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
});

export const membershipSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    userId: z.string(),
    role: groupMembershipRoleSchema,
    status: groupMembershipStatusSchema,
    points: z.number().int(),
    level: z.number().int(),
    joinedAt: z.string(),
    user: membershipUserSummarySchema.optional(),
});

export const membershipCursorInputSchema = groupSlugInputSchema.extend({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
});

export const membershipListPageSchema = z.object({
    items: z.array(membershipSchema),
    nextCursor: z.string().nullable(),
});

export const membershipTargetInputSchema = groupSlugInputSchema.extend({
    userId: z.string().min(1),
});

export const membershipApproveInputSchema = membershipTargetInputSchema.merge(
    membershipMailLocaleSchema,
);

/** Optional note included in the joiner’s decline email (not persisted). */
export const MEMBERSHIP_DECLINE_REASON_MAX_LENGTH = 500;

export const membershipDeclineInputSchema = membershipTargetInputSchema
    .merge(membershipMailLocaleSchema)
    .extend({
        declineReason: z
            .string()
            .trim()
            .max(MEMBERSHIP_DECLINE_REASON_MAX_LENGTH)
            .optional(),
    });

export const membershipUpdateRoleInputSchema =
    membershipTargetInputSchema.extend({
        role: groupMembershipRoleSchema,
    });

export type GroupSlugInput = z.infer<typeof groupSlugInputSchema>;
export type MembershipRequestJoinInput = z.infer<
    typeof membershipRequestJoinInputSchema
>;
export type MembershipApproveInput = z.infer<
    typeof membershipApproveInputSchema
>;
export type MembershipUserSummaryDto = z.infer<
    typeof membershipUserSummarySchema
>;
export type MembershipDto = z.infer<typeof membershipSchema>;
export type MembershipCursorInput = z.infer<typeof membershipCursorInputSchema>;
export type MembershipListPageDto = z.infer<typeof membershipListPageSchema>;
export type MembershipTargetInput = z.infer<typeof membershipTargetInputSchema>;
export type MembershipDeclineInput = z.infer<
    typeof membershipDeclineInputSchema
>;
export type MembershipUpdateRoleInput = z.infer<
    typeof membershipUpdateRoleInputSchema
>;

export function serializeMembershipUserSummary(user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
}): MembershipUserSummaryDto {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
    };
}

export function serializeMembership(membership: {
    id: string;
    groupId: string;
    userId: string;
    role: GroupMembershipRoleDto;
    status: GroupMembershipStatusDto;
    points: number;
    level: number;
    joinedAt: Date;
    user?: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
}): MembershipDto {
    return {
        id: membership.id,
        groupId: membership.groupId,
        userId: membership.userId,
        role: membership.role,
        status: membership.status,
        points: membership.points,
        level: membership.level,
        joinedAt: membership.joinedAt.toISOString(),
        ...(membership.user
            ? { user: serializeMembershipUserSummary(membership.user) }
            : {}),
    };
}

/** Re-export for callers that validate create-time slugs. */
export { groupSlugSchema };
