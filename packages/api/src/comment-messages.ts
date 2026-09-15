export const COMMENT_T_MESSAGES = {
    NOT_FOUND: 'comment.not_found',
    POST_NOT_FOUND: 'comment.post_not_found',
    PARENT_NOT_FOUND: 'comment.parent_not_found',
    FORBIDDEN: 'comment.forbidden',
    UNAUTHORIZED: 'comment.unauthorized',
    CREATE_SUCCESS: 'comment.create.success',
    UPDATE_SUCCESS: 'comment.update.success',
    DELETE_SUCCESS: 'comment.delete.success',
    BODY_REQUIRED: 'comment.body.required',
} as const;

export type CommentTMessage =
    (typeof COMMENT_T_MESSAGES)[keyof typeof COMMENT_T_MESSAGES];
