export const PASSWORD_SALT_ROUNDS = 12;

/** Failed logins before temporary lockout. */
export const MAX_LOGIN_ATTEMPTS = 5;

/** Lockout window after too many failed logins. */
export const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000;

/** Must match JWT password_reset expiry (1h). */
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

/** Floor for auth responses that must not leak via timing. */
export const AUTH_MIN_RESPONSE_MS = 400;
