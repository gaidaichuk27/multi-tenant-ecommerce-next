import { NextResponse } from 'next/server';
import type { z } from 'zod';
import {
    createApiSuccessResponse,
    type ApiResponse,
    type AuthTokenData,
} from '@repo/api';
import { mapUserFromDto } from '@entities/User/model/mappers';
import { backendFetch, unwrapApiResponseData } from '@lib/backend-client';
import {
    createNextResponseFromApiError,
    parseAuthRouteBody,
} from '@lib/auth/backend-auth-route';
import {
    getAuthCookieOptions,
    JWT_TOKEN_COOKIE_KEY,
} from '@shared/config/auth';

type CreateAuthSessionRouteOptions = {
    backendPath: string;
    inputSchema: z.ZodType;
    backendResponseSchema: z.ZodType;
    successStatus: number;
    tMessage: string;
    successMessage: string;
    fallbackErrorMessage: string;
};

export function createAuthSessionRoute(options: CreateAuthSessionRouteOptions) {
    return async function POST(request: Request) {
        try {
            const body = await parseAuthRouteBody(request, options.inputSchema);
            const backendResponse = await backendFetch(options.backendPath, {
                method: 'POST',
                body,
                schema: options.backendResponseSchema,
            });

            const data = unwrapApiResponseData(
                backendResponse as ApiResponse<AuthTokenData>,
            );
            const user = mapUserFromDto(data.user);

            const responseBody = createApiSuccessResponse(
                options.successStatus,
                options.tMessage,
                options.successMessage,
                { user },
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
            return createNextResponseFromApiError(
                error,
                options.fallbackErrorMessage,
            );
        }
    };
}
