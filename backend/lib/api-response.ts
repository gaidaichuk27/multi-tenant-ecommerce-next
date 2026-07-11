import type { Response } from 'express';
import {
    AUTH_T_MESSAGES,
    createApiErrorResponse,
    createApiSuccessResponse,
    type ApiResponse,
} from '@repo/api';

export function sendApiSuccess<T>(
    res: Response,
    status: number,
    tMessage: string,
    message: string,
    data?: T,
) {
    const body = createApiSuccessResponse(status, tMessage, message, data);
    res.status(status).json(body);
}

export function sendApiError(
    res: Response,
    status: number,
    tMessage: string,
    message: string,
) {
    const body = createApiErrorResponse(status, tMessage, message);
    res.status(status).json(body);
}

export function sendValidationError(res: Response, message: string) {
    sendApiError(res, 400, AUTH_T_MESSAGES.VALIDATION_ERROR, message);
}

export function sendInternalError(res: Response) {
    sendApiError(
        res,
        500,
        AUTH_T_MESSAGES.INTERNAL_ERROR,
        'Internal server error',
    );
}

export type { ApiResponse };
