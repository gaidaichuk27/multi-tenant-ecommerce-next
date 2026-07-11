export const AUTH_T_MESSAGES = {
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_INVALID_CREDENTIALS: 'auth.login.invalid_credentials',
    REGISTER_SUCCESS: 'auth.register.success',
    REGISTER_EMAIL_TAKEN: 'auth.register.email_taken',
    REGISTER_USERNAME_TAKEN: 'auth.register.username_taken',
    LOGOUT_SUCCESS: 'auth.logout.success',
    ME_SUCCESS: 'auth.me.success',
    ME_UNAUTHORIZED: 'auth.me.unauthorized',
    ME_USER_NOT_FOUND: 'auth.me.user_not_found',
    VALIDATION_ERROR: 'common.validation.error',
    INTERNAL_ERROR: 'common.error.internal',
    /** Password reset/change — Phase 0 follow-up (Express + Next proxy routes). */
    PASSWORD_NOT_IMPLEMENTED: 'auth.password.not_implemented',
} as const;

export type AuthTMessage =
    (typeof AUTH_T_MESSAGES)[keyof typeof AUTH_T_MESSAGES];
