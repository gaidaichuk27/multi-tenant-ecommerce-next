import {
    ApiError,
    authEmptyApiResponseSchema,
    authUserApiResponseSchema,
} from '@repo/api';
import { requestApi } from '@lib/api-client';

export type PasswordForgotInput = {
    email: string;
    locale?: string;
};

export type PasswordRestoreInput = {
    password: string;
    token: string;
};

export type PasswordChangeInput = {
    oldPassword: string;
    newPassword: string;
    locale?: string;
};

async function requestPasswordAction(
    path: string,
    input: unknown,
): Promise<void> {
    const parsed = await requestApi(path, {
        body: input,
        schema: authEmptyApiResponseSchema,
    });

    if (!parsed.success) {
        throw new ApiError(parsed.status, parsed.tMessage, parsed.message);
    }
}

export function requestPasswordForgot(input: PasswordForgotInput) {
    return requestPasswordAction('/api/auth/password-forgot', input);
}

export function restorePassword(input: PasswordRestoreInput) {
    return requestPasswordAction('/api/auth/password-restore', input);
}

export async function changePassword(input: PasswordChangeInput) {
    const parsed = await requestApi('/api/auth/password-change', {
        body: input,
        schema: authUserApiResponseSchema,
    });

    if (!parsed.success) {
        throw new ApiError(parsed.status, parsed.tMessage, parsed.message);
    }
}

export function resendVerificationEmail(locale?: string) {
    return requestPasswordAction('/api/auth/resend-verification', {
        locale,
    });
}
