export const MEMBERSHIP_T_MESSAGES = {
    NOT_FOUND: 'membership.not_found',
    GROUP_NOT_FOUND: 'membership.group_not_found',
    FORBIDDEN: 'membership.forbidden',
    UNAUTHORIZED: 'membership.unauthorized',
    ALREADY_MEMBER: 'membership.already_member',
    BANNED: 'membership.banned',
    PENDING: 'membership.pending',
    OWNER_CANNOT_LEAVE: 'membership.owner_cannot_leave',
    OWNER_CANNOT_BAN: 'membership.owner_cannot_ban',
    LAST_OWNER: 'membership.last_owner',
    JOIN_SUCCESS: 'membership.join.success',
    JOIN_PENDING: 'membership.join.pending',
    LEAVE_SUCCESS: 'membership.leave.success',
    APPROVE_SUCCESS: 'membership.approve.success',
    DECLINE_SUCCESS: 'membership.decline.success',
    ROLE_UPDATED: 'membership.role.updated',
    BAN_SUCCESS: 'membership.ban.success',
    SLUG_REQUIRED: 'membership.slug_required',
} as const;

export type MembershipTMessage =
    (typeof MEMBERSHIP_T_MESSAGES)[keyof typeof MEMBERSHIP_T_MESSAGES];
