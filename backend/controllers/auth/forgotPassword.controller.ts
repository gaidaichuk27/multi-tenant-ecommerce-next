import type { Request, Response, NextFunction } from 'express';
import { AUTH_T_MESSAGES, passwordForgotInputSchema } from '@repo/api';
import { db } from '@repo/database';
import { sendApiSuccess } from '../../lib/api-response';
import { signPasswordResetToken } from '../../lib/jwt';
import { sendPasswordResetEmail } from '../../lib/mailer/auth-emails';
import { ensureMinDuration, hashToken } from '../../lib/token-hash';
import {
    AUTH_MIN_RESPONSE_MS,
    PASSWORD_RESET_TTL_MS,
    PASSWORD_SALT_ROUNDS,
} from './constants';
import bcrypt from 'bcryptjs';

export async function forgotPasswordController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const startedAt = Date.now();

    try {
        const input = passwordForgotInputSchema.parse(req.body);
        const user = await db.user.findUnique({
            where: { email: input.email },
        });

        if (user) {
            const previousToken = user.resetPasswordToken;
            const previousExpiration = user.resetPasswordExpiration;
            const token = signPasswordResetToken(user.id);

            await db.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: hashToken(token),
                    resetPasswordExpiration: new Date(
                        Date.now() + PASSWORD_RESET_TTL_MS,
                    ),
                },
            });

            try {
                await sendPasswordResetEmail(user, input.locale, token);
            } catch (error) {
                console.error('Failed to send password reset email:', error);
                // Restore prior reset state so a transient SMTP failure does
                // not wipe a still-valid link the user may already have.
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        resetPasswordToken: previousToken,
                        resetPasswordExpiration: previousExpiration,
                    },
                });
            }
        } else {
            // Burn comparable CPU so missing emails are harder to time.
            await bcrypt.hash(input.email, PASSWORD_SALT_ROUNDS);
        }

        await ensureMinDuration(startedAt, AUTH_MIN_RESPONSE_MS);
        // Always the same success body — do not leak whether SMTP ran.
        sendApiSuccess(
            res,
            200,
            AUTH_T_MESSAGES.PASSWORD_FORGOT_SUCCESS,
            'If an account exists for this email, a reset link has been sent.',
        );
    } catch (error) {
        next(error);
    }
}
