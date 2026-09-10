import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import {
    AUTH_T_MESSAGES,
    passwordChangeInputSchema,
    serializeUser,
} from '@repo/api';
import { db } from '@repo/database';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';
import { signAccessToken } from '../../lib/jwt';
import { sendPasswordChangedEmail } from '../../lib/mailer/auth-emails';
import { PASSWORD_SALT_ROUNDS } from './constants';

export async function changePasswordController(
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

        const input = passwordChangeInputSchema.parse(req.body);

        const isValidPassword = await bcrypt.compare(
            input.oldPassword,
            user.passwordHash,
        );

        if (!isValidPassword) {
            sendApiError(
                res,
                400,
                AUTH_T_MESSAGES.PASSWORD_CHANGE_INVALID_CURRENT,
                'Current password is incorrect',
            );
            return;
        }

        const passwordHash = await bcrypt.hash(
            input.newPassword,
            PASSWORD_SALT_ROUNDS,
        );

        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                tokenVersion: { increment: 1 },
                resetPasswordToken: null,
                resetPasswordExpiration: null,
                loginAttempts: 0,
                lockUntil: null,
            },
        });

        const token = signAccessToken(updatedUser.id, updatedUser.tokenVersion);

        // Best-effort security notification — do not fail the change if SMTP errors.
        void sendPasswordChangedEmail(
            { id: updatedUser.id, email: updatedUser.email },
            input.locale,
        );

        sendApiSuccess(
            res,
            200,
            AUTH_T_MESSAGES.PASSWORD_CHANGE_SUCCESS,
            'Password has been changed successfully',
            {
                token,
                user: serializeUser(updatedUser),
            },
        );
    } catch (error) {
        next(error);
    }
}
