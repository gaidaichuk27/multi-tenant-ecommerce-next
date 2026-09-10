export const JWT_TOKEN_COOKIE_KEY = 'jwt_token';

export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Password reset/change APIs are implemented via Express + Next `/api/auth/password-*` proxies.
 */
export const PASSWORD_AUTH_ENABLED = true;

export function getAuthCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
    };
}
