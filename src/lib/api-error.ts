import { ZodError } from 'zod';
import {
    ApiError,
    AUTH_T_MESSAGES,
    createApiErrorResponse,
    type ApiResponse,
} from '@repo/api';

export function resolveRouteApiError(
    error: unknown,
    fallbackMessage: string,
): ApiResponse<void> {
    if (error instanceof ApiError) {
        return error.toResponse();
    }

    if (error instanceof ZodError) {
        return createApiErrorResponse(
            400,
            AUTH_T_MESSAGES.VALIDATION_ERROR,
            error.issues[0]?.message ?? 'Invalid request body',
        );
    }

    return createApiErrorResponse(
        500,
        AUTH_T_MESSAGES.INTERNAL_ERROR,
        fallbackMessage,
    );
}
