import { NextResponse } from 'next/server';
import type { z } from 'zod';
import type { ApiResponse } from '@repo/api';
import { resolveRouteApiError } from '@lib/api-error';
import { backendFetch } from '@lib/backend-client';
import { extractBearerToken } from '@lib/auth/session';

export function appendRequestQueryToPath(
    backendPath: string,
    requestUrl: string,
): string {
    const query = new URL(requestUrl).searchParams.toString();

    return query ? `${backendPath}?${query}` : backendPath;
}

export async function parseAuthRouteBody(
    request: Request,
    inputSchema?: z.ZodType,
): Promise<unknown> {
    const payload = await request.json().catch(() => ({}));

    return inputSchema ? inputSchema.parse(payload) : payload;
}

export function buildForwardAuthHeaders(
    request: Request,
    forwardAuth?: boolean,
): HeadersInit | undefined {
    if (!forwardAuth) {
        return undefined;
    }

    const token = extractBearerToken(request.headers);

    if (!token) {
        return undefined;
    }

    return { Authorization: `Bearer ${token}` };
}

export function createNextResponseFromApi<T>(
    response: ApiResponse<T>,
): NextResponse {
    return NextResponse.json(response, { status: response.status });
}

export function createNextResponseFromApiError(
    error: unknown,
    fallbackErrorMessage: string,
): NextResponse {
    const body = resolveRouteApiError(error, fallbackErrorMessage);

    return NextResponse.json(body, { status: body.status });
}

export type ProxyBackendAuthRouteOptions<TSchema extends z.ZodType> = {
    backendPath: string;
    inputSchema?: z.ZodType;
    backendResponseSchema: TSchema;
    method?: 'GET' | 'POST';
    forwardAuth?: boolean;
};

export async function proxyBackendAuthRoute<TSchema extends z.ZodType>(
    request: Request,
    options: ProxyBackendAuthRouteOptions<TSchema>,
) {
    const method = options.method ?? 'POST';
    const path =
        method === 'GET'
            ? appendRequestQueryToPath(options.backendPath, request.url)
            : options.backendPath;
    const body =
        method === 'GET'
            ? undefined
            : await parseAuthRouteBody(request, options.inputSchema);

    return backendFetch(path, {
        method,
        body,
        headers: buildForwardAuthHeaders(request, options.forwardAuth),
        schema: options.backendResponseSchema,
    });
}
