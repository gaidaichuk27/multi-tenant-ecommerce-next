import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AUTH_T_MESSAGES, loginInputSchema, serializeUser } from '@repo/api';
import { db } from '@repo/database';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';
import { signAccessToken } from '../../lib/jwt';
import { ensureMinDuration } from '../../lib/token-hash';
import {
    AUTH_MIN_RESPONSE_MS,
    LOGIN_LOCK_DURATION_MS,
    MAX_LOGIN_ATTEMPTS,
    PASSWORD_SALT_ROUNDS,
} from './constants';

/** Precomputed hash so missing-user paths still pay bcrypt cost. */
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(
    'timing-oracle-placeholder',
    PASSWORD_SALT_ROUNDS,
);

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const startedAt = Date.now();

    try {
        const input = loginInputSchema.parse(req.body);

        const user = await db.user.findUnique({
            where: { email: input.email },
        });

        if (user?.lockUntil && user.lockUntil.getTime() > Date.now()) {
            await bcrypt.compare(input.password, DUMMY_PASSWORD_HASH);
            await ensureMinDuration(startedAt, AUTH_MIN_RESPONSE_MS);
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.LOGIN_INVALID_CREDENTIALS,
                'Invalid email or password',
            );
            return;
        }

        if (!user) {
            await bcrypt.compare(input.password, DUMMY_PASSWORD_HASH);
            await ensureMinDuration(startedAt, AUTH_MIN_RESPONSE_MS);
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.LOGIN_INVALID_CREDENTIALS,
                'Invalid email or password',
            );
            return;
        }

        const isValidPassword = await bcrypt.compare(
            input.password,
            user.passwordHash,
        );

        if (!isValidPassword) {
            const nextAttempts = user.loginAttempts + 1;
            const shouldLock = nextAttempts >= MAX_LOGIN_ATTEMPTS;

            await db.user.update({
                where: { id: user.id },
                data: shouldLock
                    ? {
                          loginAttempts: 0,
                          lockUntil: new Date(
                              Date.now() + LOGIN_LOCK_DURATION_MS,
                          ),
                      }
                    : { loginAttempts: nextAttempts },
            });

            await ensureMinDuration(startedAt, AUTH_MIN_RESPONSE_MS);
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.LOGIN_INVALID_CREDENTIALS,
                'Invalid email or password',
            );
            return;
        }

        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockUntil: null,
            },
        });

        const token = signAccessToken(updatedUser.id, updatedUser.tokenVersion);

        await ensureMinDuration(startedAt, AUTH_MIN_RESPONSE_MS);
        sendApiSuccess(
            res,
            200,
            AUTH_T_MESSAGES.LOGIN_SUCCESS,
            'Login successful',
            {
                token,
                user: serializeUser(updatedUser),
            },
        );
    } catch (error) {
        next(error);
    }
}
