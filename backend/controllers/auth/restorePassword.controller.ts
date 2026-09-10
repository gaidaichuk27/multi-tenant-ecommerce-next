import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AUTH_T_MESSAGES, passwordRestoreInputSchema } from '@repo/api';
import { db } from '@repo/database';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';
import {
    InvalidTokenError,
    TokenExpiredError,
    verifyPurposeToken,
} from '../../lib/jwt';
import { hashToken } from '../../lib/token-hash';
import { PASSWORD_SALT_ROUNDS } from './constants';

export async function restorePasswordController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const input = passwordRestoreInputSchema.parse(req.body);

        try {
            const { userId } = verifyPurposeToken(
                input.token,
                'password_reset',
            );
            const tokenHash = hashToken(input.token);
            const passwordHash = await bcrypt.hash(
                input.password,
                PASSWORD_SALT_ROUNDS,
            );

            // Atomic consume: only one concurrent restore can match the hash.
            const result = await db.user.updateMany({
                where: {
                    id: userId,
                    resetPasswordToken: tokenHash,
                    resetPasswordExpiration: { gt: new Date() },
                },
                data: {
                    passwordHash,
                    resetPasswordToken: null,
                    resetPasswordExpiration: null,
                    tokenVersion: { increment: 1 },
                    loginAttempts: 0,
                    lockUntil: null,
                },
            });

            if (result.count === 0) {
                // Clear expired token if present so it cannot be retried.
                await db.user.updateMany({
                    where: {
                        id: userId,
                        resetPasswordExpiration: { lte: new Date() },
                    },
                    data: {
                        resetPasswordToken: null,
                        resetPasswordExpiration: null,
                    },
                });

                sendApiError(
                    res,
                    401,
                    AUTH_T_MESSAGES.PASSWORD_RESTORE_TOKEN_INVALID,
                    'Invalid or expired reset token',
                );
                return;
            }

            sendApiSuccess(
                res,
                200,
                AUTH_T_MESSAGES.PASSWORD_RESTORE_SUCCESS,
                'Password has been reset successfully',
            );
        } catch (error) {
            if (
                error instanceof InvalidTokenError ||
                error instanceof TokenExpiredError
            ) {
                sendApiError(
                    res,
                    401,
                    AUTH_T_MESSAGES.PASSWORD_RESTORE_TOKEN_INVALID,
                    'Invalid or expired reset token',
                );
                return;
            }

            throw error;
        }
    } catch (error) {
        next(error);
    }
}
