import type { z } from 'zod';
import { ApiError, AUTH_T_MESSAGES, parseApiErrorPayload } from '@repo/api';

type RequestApiOptions<TSchema extends z.ZodType> = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    schema: TSchema;
    credentials?: RequestCredentials;
};

export async function requestApi<TSchema extends z.ZodType>(
    path: string,
    options: RequestApiOptions<TSchema>,
): Promise<z.infer<TSchema>> {
    const response = await fetch(path, {
        method: options.method ?? 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:
            options.body === undefined
                ? undefined
                : JSON.stringify(options.body),
        credentials: options.credentials ?? 'include',
    });

    const payload: unknown = await response.json();

    if (!response.ok) {
        throw (
            parseApiErrorPayload(payload, response.status) ??
            new ApiError(
                response.status,
                AUTH_T_MESSAGES.INTERNAL_ERROR,
                'Request failed',
            )
        );
    }

    const parsed = options.schema.safeParse(payload);

    if (!parsed.success) {
        throw new ApiError(
            500,
            AUTH_T_MESSAGES.INTERNAL_ERROR,
            'Invalid API response',
        );
    }

    return parsed.data;
}
