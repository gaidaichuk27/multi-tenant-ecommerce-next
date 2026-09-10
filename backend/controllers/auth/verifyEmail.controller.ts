import type { Request, Response, NextFunction } from 'express';
import { AUTH_T_MESSAGES, verifyEmailQuerySchema } from '@repo/api';
import { db } from '@repo/database';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';
import {
    InvalidTokenError,
    TokenExpiredError,
    verifyPurposeToken,
} from '../../lib/jwt';
import { sendEmailConfirmedEmail } from '../../lib/mailer/auth-emails';

function sendUserNotFound(res: Response) {
    sendApiError(res, 404, AUTH_T_MESSAGES.ME_USER_NOT_FOUND, 'User not found');
}

function sendAlreadyConfirmed(res: Response) {
    sendApiSuccess(
        res,
        200,
        AUTH_T_MESSAGES.VERIFY_ALREADY_CONFIRMED,
        'Email already verified',
    );
}

export async function verifyEmailController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const token = req.query.token;
        const localeQuery = req.query.locale;

        if (!token || typeof token !== 'string') {
            sendApiError(
                res,
                400,
                AUTH_T_MESSAGES.VERIFY_TOKEN_MISSING,
                'Verification token is required',
            );
            return;
        }

        const query = verifyEmailQuerySchema.parse({
            token,
            locale: typeof localeQuery === 'string' ? localeQuery : undefined,
        });

        let userId: string;

        try {
            ({ userId } = verifyPurposeToken(query.token, 'email_verify'));
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                // Do not auto-resend — expired JWTs are stable identifiers and
                // would mail-bomb via prefetch/replay. User must use resend.
                sendApiError(
                    res,
                    401,
                    AUTH_T_MESSAGES.VERIFY_TOKEN_EXPIRED,
                    'Verification link expired. Please request a new one.',
                );
                return;
            }

            if (error instanceof InvalidTokenError) {
                sendApiError(
                    res,
                    401,
                    AUTH_T_MESSAGES.VERIFY_TOKEN_INVALID,
                    'Invalid verification token',
                );
                return;
            }

            throw error;
        }

        const user = await db.user.findUnique({ where: { id: userId } });

        if (!user) {
            sendUserNotFound(res);
            return;
        }

        if (user.isEmailConfirmed) {
            sendAlreadyConfirmed(res);
            return;
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { isEmailConfirmed: true },
        });

        try {
            await sendEmailConfirmedEmail(updatedUser, query.locale);
        } catch (error) {
            console.error('Failed to send email confirmation notice:', error);
        }

        // Do not echo email — anyone with a (possibly leaked) token must not
        // learn the account address from this endpoint.
        sendApiSuccess(
            res,
            200,
            AUTH_T_MESSAGES.VERIFY_SUCCESS,
            'Email verified successfully',
        );
    } catch (error) {
        next(error);
    }
}
