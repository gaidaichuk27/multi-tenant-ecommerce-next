import type { Request, Response, NextFunction } from 'express';
import { AUTH_T_MESSAGES, serializeUser } from '@repo/api';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';

export async function meController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const user = req.user;

        if (!user) {
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.ME_UNAUTHORIZED,
                'Unauthorized',
            );
            return;
        }

        sendApiSuccess(res, 200, AUTH_T_MESSAGES.ME_SUCCESS, 'Session loaded', {
            user: serializeUser(user),
        });
    } catch (error) {
        next(error);
    }
}
