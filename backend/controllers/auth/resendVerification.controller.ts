import type { Request, Response, NextFunction } from 'express';
import { AUTH_T_MESSAGES, resendVerificationInputSchema } from '@repo/api';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';
import { resendAccountVerificationEmail } from '../../lib/mailer/auth-emails';

export async function resendVerificationController(
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

        const input = resendVerificationInputSchema.parse(req.body ?? {});

        if (user.isEmailConfirmed) {
            sendApiSuccess(
                res,
                200,
                AUTH_T_MESSAGES.RESEND_VERIFICATION_ALREADY,
                'Email is already verified',
            );
            return;
        }

        await resendAccountVerificationEmail(user, input.locale);

        sendApiSuccess(
            res,
            200,
            AUTH_T_MESSAGES.RESEND_VERIFICATION_SUCCESS,
            'Verification email sent',
        );
    } catch (error) {
        next(error);
    }
}
