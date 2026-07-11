import type { ErrorRequestHandler } from 'express';
import { ApiError, AUTH_T_MESSAGES, createApiErrorResponse } from '@repo/api';
import { ZodError } from 'zod';

function resolveTMessageForStatus(status: number): string {
    if (status === 400) {
        return AUTH_T_MESSAGES.VALIDATION_ERROR;
    }

    if (status === 401) {
        return AUTH_T_MESSAGES.ME_UNAUTHORIZED;
    }

    if (status >= 500) {
        return AUTH_T_MESSAGES.INTERNAL_ERROR;
    }

    return AUTH_T_MESSAGES.INTERNAL_ERROR;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    console.error(err);

    if (err instanceof ZodError) {
        const body = createApiErrorResponse(
            400,
            AUTH_T_MESSAGES.VALIDATION_ERROR,
            err.issues[0]?.message ?? 'Invalid request body',
        );
        res.status(400).json(body);
        return;
    }

    if (err instanceof ApiError) {
        const body = createApiErrorResponse(
            err.status,
            err.tMessage,
            err.message,
        );
        res.status(err.status).json(body);
        return;
    }

    const status =
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        typeof err.status === 'number'
            ? err.status
            : 500;

    const message =
        status === 500 ? 'Internal server error' : String(err.message ?? err);

    const tMessage =
        typeof err === 'object' &&
        err !== null &&
        'tMessage' in err &&
        typeof err.tMessage === 'string'
            ? err.tMessage
            : resolveTMessageForStatus(status);

    const body = createApiErrorResponse(status, tMessage, message);
    res.status(status).json(body);
};
