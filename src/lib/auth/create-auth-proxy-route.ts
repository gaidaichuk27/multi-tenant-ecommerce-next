import type { z } from 'zod';
import type { ApiResponse } from '@repo/api';
import {
    createNextResponseFromApi,
    createNextResponseFromApiError,
    proxyBackendAuthRoute,
    type ProxyBackendAuthRouteOptions,
} from '@lib/auth/backend-auth-route';

type CreateAuthProxyRouteOptions<TSchema extends z.ZodType> =
    ProxyBackendAuthRouteOptions<TSchema> & {
        fallbackErrorMessage: string;
    };

export function createAuthProxyRoute<TSchema extends z.ZodType>(
    options: CreateAuthProxyRouteOptions<TSchema>,
) {
    return async function handler(request: Request) {
        try {
            const backendResponse = await proxyBackendAuthRoute(
                request,
                options,
            );

            return createNextResponseFromApi(
                backendResponse as ApiResponse<unknown>,
            );
        } catch (error) {
            return createNextResponseFromApiError(
                error,
                options.fallbackErrorMessage,
            );
        }
    };
}
