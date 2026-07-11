export const GROUP_T_MESSAGES = {
    CREATE_SUCCESS: 'group.create.success',
    SLUG_TAKEN: 'group.create.slug_taken',
    NOT_FOUND: 'group.not_found',
    UNAUTHORIZED: 'group.unauthorized',
} as const;

export type GroupTMessage =
    (typeof GROUP_T_MESSAGES)[keyof typeof GROUP_T_MESSAGES];
