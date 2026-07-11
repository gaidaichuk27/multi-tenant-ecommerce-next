import {
    ApiError,
    AUTH_T_MESSAGES,
    authLogoutApiResponseSchema,
} from '@repo/api';
import { requestApi } from '@lib/api-client';
import { PASSWORD_AUTH_ENABLED } from '@shared/config/auth';

export type PasswordForgotInput = {
    email: string;
};

export type PasswordRestoreInput = {
    password: string;
    token?: string;
};

export type PasswordChangeInput = {
    oldPassword: string;
    newPassword: string;
};

/**
 * Phase 0 follow-up: implement Express password routes and Next proxies at
 * `/api/auth/password-forgot`, `password-restore`, `password-change`.
 */
async function requestPasswordAction(
    path: string,
    input: unknown,
): Promise<void> {
    if (!PASSWORD_AUTH_ENABLED) {
        throw new ApiError(
            501,
            AUTH_T_MESSAGES.PASSWORD_NOT_IMPLEMENTED,
            'Password reset is not available yet',
        );
    }

    const parsed = await requestApi(path, {
        body: input,
        schema: authLogoutApiResponseSchema,
    });

    if (!parsed.success) {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.INTERNAL_ERROR,
            'Invalid response',
        );
    }
}

export function requestPasswordForgot(input: PasswordForgotInput) {
    return requestPasswordAction('/api/auth/password-forgot', input);
}

export function restorePassword(input: PasswordRestoreInput) {
    return requestPasswordAction('/api/auth/password-restore', input);
}

export function changePassword(input: PasswordChangeInput) {
    return requestPasswordAction('/api/auth/password-change', input);
}
