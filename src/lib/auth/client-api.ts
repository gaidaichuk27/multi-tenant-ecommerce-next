import {
    ApiError,
    AUTH_T_MESSAGES,
    authLogoutApiResponseSchema,
    authUserApiResponseSchema,
    type LoginInput,
    type RegisterInput,
} from '@repo/api';
import { requestApi } from '@lib/api-client';

async function requestAuth(
    path: string,
    input: LoginInput | RegisterInput,
): Promise<void> {
    const parsed = await requestApi(path, {
        body: input,
        schema: authUserApiResponseSchema,
    });

    if (!parsed.data?.user) {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.INTERNAL_ERROR,
            'Invalid auth response',
        );
    }
}

export function loginWithCredentials(input: LoginInput) {
    return requestAuth('/api/auth/login', input);
}

export function registerAccount(input: RegisterInput) {
    return requestAuth('/api/auth/register', input);
}

export function logoutAccount() {
    return requestApi('/api/auth/logout', {
        method: 'POST',
        schema: authLogoutApiResponseSchema,
    });
}
