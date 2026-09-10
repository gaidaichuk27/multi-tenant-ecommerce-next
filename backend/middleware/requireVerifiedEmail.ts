import type { NextFunction, Request, Response } from 'express';
import { AUTH_T_MESSAGES } from '@repo/api';
import { sendApiError } from '../lib/api-response';

export async function requireVerifiedEmail(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const user = req.user;

    if (!user) {
        sendApiError(res, 401, AUTH_T_MESSAGES.ME_UNAUTHORIZED, 'Unauthorized');
        return;
    }

    if (!user.isEmailConfirmed) {
        sendApiError(
            res,
            403,
            AUTH_T_MESSAGES.EMAIL_NOT_CONFIRMED,
            'Email confirmation is required',
        );
        return;
    }

    next();
}
