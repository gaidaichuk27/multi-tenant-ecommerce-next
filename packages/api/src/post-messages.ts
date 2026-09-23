export const POST_T_MESSAGES = {
    NOT_FOUND: 'post.not_found',
    GROUP_NOT_FOUND: 'post.group_not_found',
    FORBIDDEN: 'post.forbidden',
    UNAUTHORIZED: 'post.unauthorized',
    CREATE_SUCCESS: 'post.create.success',
    UPDATE_SUCCESS: 'post.update.success',
    DELETE_SUCCESS: 'post.delete.success',
    REPORT_SUCCESS: 'post.report.success',
    REPORT_OWN_FORBIDDEN: 'post.report.own_forbidden',
    REPORT_ALREADY_OPEN: 'post.report.already_open',
    REPORT_ALREADY_CLOSED: 'post.report.already_closed',
    REPORT_NOT_FOUND: 'post.report.not_found',
    REPORT_RESOLVE_SUCCESS: 'post.report.resolve.success',
    REPORT_DISMISS_SUCCESS: 'post.report.dismiss.success',
    BODY_REQUIRED: 'post.body.required',
    SLUG_REQUIRED: 'post.slug_required',
} as const;

export type PostTMessage =
    (typeof POST_T_MESSAGES)[keyof typeof POST_T_MESSAGES];
