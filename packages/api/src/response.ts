import { z } from 'zod';
import { AUTH_T_MESSAGES } from './auth-messages';

/** Standard API body returned by Express and Next route handlers. */
export interface ApiResponse<T = void> {
    status: number;
    success: boolean;
    tMessage: string;
    message: string;
    data?: T;
}

/** Client wrapper shape for failed HTTP responses (e.g. fetch/axios adapters). */
export interface ErrorApiResponse {
    error: {
        data: {
            success: boolean;
            status: number;
            tMessage: string;
            message: string;
        };
        status: number;
    };
}

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
    z.object({
        status: z.number().int(),
        success: z.boolean(),
        tMessage: z.string(),
        message: z.string(),
        data: dataSchema.optional(),
    });

export type ApiResponseDto<T extends z.ZodType> = z.infer<
    ReturnType<typeof apiResponseSchema<T>>
>;

export function createApiSuccessResponse<T>(
    status: number,
    tMessage: string,
    message: string,
    data?: T,
): ApiResponse<T> {
    return {
        status,
        success: true,
        tMessage,
        message,
        ...(data !== undefined ? { data } : {}),
    };
}

export function createApiErrorResponse(
    status: number,
    tMessage: string,
    message: string,
): ApiResponse<void> {
    return {
        status,
        success: false,
        tMessage,
        message,
    };
}

export class ApiError extends Error {
    readonly status: number;
    readonly tMessage: string;

    constructor(status: number, tMessage: string, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.tMessage = tMessage;
    }

    toResponse(): ApiResponse<void> {
        return createApiErrorResponse(this.status, this.tMessage, this.message);
    }
}

function extractRawErrorMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    if ('message' in payload && typeof payload.message === 'string') {
        return payload.message;
    }

    if (
        'error' in payload &&
        payload.error &&
        typeof payload.error === 'object' &&
        'data' in payload.error
    ) {
        return extractRawErrorMessage(payload.error.data);
    }

    return null;
}

export function isApiError(error: unknown): error is ApiError {
    if (error instanceof ApiError) {
        return true;
    }

    return (
        typeof error === 'object' &&
        error !== null &&
        (error as ApiError).name === 'ApiError' &&
        typeof (error as ApiError).status === 'number' &&
        typeof (error as ApiError).tMessage === 'string'
    );
}

export function parseApiErrorPayload(
    payload: unknown,
    fallbackStatus = 500,
): ApiError | null {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const direct = payload as Partial<ApiResponse<void>>;

    if (direct.success === true) {
        return null;
    }

    if (
        typeof direct.status === 'number' &&
        direct.success === false &&
        typeof direct.tMessage === 'string' &&
        typeof direct.message === 'string'
    ) {
        return new ApiError(direct.status, direct.tMessage, direct.message);
    }

    if (
        'error' in payload &&
        payload.error &&
        typeof payload.error === 'object' &&
        'data' in payload.error
    ) {
        return parseApiErrorPayload(payload.error.data, fallbackStatus);
    }

    const message = extractRawErrorMessage(payload);

    if (!message) {
        return null;
    }

    return new ApiError(
        fallbackStatus,
        AUTH_T_MESSAGES.INTERNAL_ERROR,
        message,
    );
}

export function getApiErrorMessage(payload: unknown): string | null {
    return parseApiErrorPayload(payload)?.message ?? null;
}

export function toApiError(error: unknown, fallback: ApiError): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (error instanceof Error) {
        return new ApiError(fallback.status, fallback.tMessage, error.message);
    }

    return fallback;
}
