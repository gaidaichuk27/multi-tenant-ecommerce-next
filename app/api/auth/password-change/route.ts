import { NextResponse } from 'next/server';
import {
    AUTH_T_MESSAGES,
    authPasswordChangeApiResponseSchema,
    createApiSuccessResponse,
    passwordChangeInputSchema,
    type ApiResponse,
    type AuthTokenData,
} from '@repo/api';
import { mapUserFromDto } from '@entities/User/model/mappers';
import {
    createNextResponseFromApiError,
    proxyBackendAuthRoute,
} from '@lib/auth/backend-auth-route';
import {
    getAuthCookieOptions,
    JWT_TOKEN_COOKIE_KEY,
} from '@shared/config/auth';

export async function POST(request: Request) {
    try {
        const backendResponse = await proxyBackendAuthRoute(request, {
            backendPath: '/api/auth/password-change',
            inputSchema: passwordChangeInputSchema,
            backendResponseSchema: authPasswordChangeApiResponseSchema,
            forwardAuth: true,
        });

        const data = (backendResponse as ApiResponse<AuthTokenData>).data;

        if (!data?.token || !data.user) {
            throw new Error('Password change response missing token');
        }

        const responseBody = createApiSuccessResponse(
            200,
            AUTH_T_MESSAGES.PASSWORD_CHANGE_SUCCESS,
            'Password has been changed successfully',
            { user: mapUserFromDto(data.user) },
        );

        const response = NextResponse.json(responseBody, {
            status: responseBody.status,
        });
        response.cookies.set(
            JWT_TOKEN_COOKIE_KEY,
            data.token,
            getAuthCookieOptions(),
        );

        return response;
    } catch (error) {
        return createNextResponseFromApiError(error, 'Password change failed');
    }
}
