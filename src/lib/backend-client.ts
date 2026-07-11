import type { z } from 'zod';
import {
    ApiError,
    AUTH_T_MESSAGES,
    parseApiErrorPayload,
    type ApiResponse,
} from '@repo/api';

const DEFAULT_BACKEND_URL = 'http://localhost:8080';

function getBackendUrl(): string {
    return process.env.BACKEND_URL ?? DEFAULT_BACKEND_URL;
}

type BackendFetchOptions<TSchema extends z.ZodType | undefined> = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: HeadersInit;
    schema?: TSchema;
};

export async function backendFetch<
    TSchema extends z.ZodType | undefined = undefined,
>(
    path: string,
    options?: BackendFetchOptions<TSchema>,
): Promise<TSchema extends z.ZodType ? z.infer<TSchema> : unknown> {
    const response = await fetch(`${getBackendUrl()}${path}`, {
        method: options?.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body:
            options?.body === undefined
                ? undefined
                : JSON.stringify(options.body),
        cache: 'no-store',
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw (
            parseApiErrorPayload(payload, response.status) ??
            new ApiError(
                response.status,
                AUTH_T_MESSAGES.INTERNAL_ERROR,
                `Backend request failed with status ${response.status}`,
            )
        );
    }

    if (options?.schema) {
        const parsed = options.schema.parse(payload);

        if (
            parsed &&
            typeof parsed === 'object' &&
            'success' in parsed &&
            parsed.success === false
        ) {
            throw (
                parseApiErrorPayload(parsed) ??
                new ApiError(
                    500,
                    AUTH_T_MESSAGES.INTERNAL_ERROR,
                    'Request failed',
                )
            );
        }

        return parsed as TSchema extends z.ZodType ? z.infer<TSchema> : unknown;
    }

    return payload as TSchema extends z.ZodType ? z.infer<TSchema> : unknown;
}

export function unwrapApiResponseData<T>(response: ApiResponse<T>): T {
    if (!response.success || response.data === undefined) {
        throw new ApiError(
            response.status,
            response.tMessage,
            response.message,
        );
    }

    return response.data;
}
