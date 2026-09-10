import { ApiError, authVerifyEmailApiResponseSchema } from '@repo/api';
import { requestApi } from '@lib/api-client';

export async function verifyEmail(token: string, locale?: string) {
    const params = new URLSearchParams({ token });

    if (locale) {
        params.set('locale', locale);
    }

    const parsed = await requestApi(
        `/api/auth/verify-email?${params.toString()}`,
        {
            method: 'GET',
            schema: authVerifyEmailApiResponseSchema,
        },
    );

    if (!parsed.success) {
        throw new ApiError(parsed.status, parsed.tMessage, parsed.message);
    }

    return parsed;
}
