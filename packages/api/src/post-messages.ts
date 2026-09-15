export const POST_T_MESSAGES = {
    NOT_FOUND: 'post.not_found',
    GROUP_NOT_FOUND: 'post.group_not_found',
    FORBIDDEN: 'post.forbidden',
    UNAUTHORIZED: 'post.unauthorized',
    CREATE_SUCCESS: 'post.create.success',
    UPDATE_SUCCESS: 'post.update.success',
    DELETE_SUCCESS: 'post.delete.success',
    BODY_REQUIRED: 'post.body.required',
    SLUG_REQUIRED: 'post.slug_required',
} as const;

export type PostTMessage =
    (typeof POST_T_MESSAGES)[keyof typeof POST_T_MESSAGES];
