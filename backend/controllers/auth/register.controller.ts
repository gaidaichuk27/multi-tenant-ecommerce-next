import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AUTH_T_MESSAGES, registerInputSchema, serializeUser } from '@repo/api';
import { db, Prisma } from '@repo/database';
import { sendApiError, sendApiSuccess } from '../../lib/api-response';
import { signAccessToken } from '../../lib/jwt';
import { sendAccountVerificationEmail } from '../../lib/mailer/auth-emails';
import { PASSWORD_SALT_ROUNDS } from './constants';

function isUniqueConstraintError(
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    );
}

export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const input = registerInputSchema.parse(req.body);

        const existingUserByEmail = await db.user.findUnique({
            where: { email: input.email },
        });

        if (existingUserByEmail) {
            sendApiError(
                res,
                409,
                AUTH_T_MESSAGES.REGISTER_EMAIL_TAKEN,
                'Email already registered',
            );
            return;
        }

        const existingUserByUsername = await db.user.findUnique({
            where: { username: input.username },
        });

        if (existingUserByUsername) {
            sendApiError(
                res,
                409,
                AUTH_T_MESSAGES.REGISTER_USERNAME_TAKEN,
                'Username already taken',
            );
            return;
        }

        const passwordHash = await bcrypt.hash(
            input.password,
            PASSWORD_SALT_ROUNDS,
        );

        let user;

        try {
            user = await db.user.create({
                data: {
                    email: input.email,
                    username: input.username,
                    name: input.name ?? input.username,
                    passwordHash,
                    isEmailConfirmed: false,
                },
            });
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                const target = error.meta?.target;
                const fields = Array.isArray(target)
                    ? target.map(String)
                    : typeof target === 'string'
                      ? [target]
                      : [];

                if (fields.some((field) => field.includes('username'))) {
                    sendApiError(
                        res,
                        409,
                        AUTH_T_MESSAGES.REGISTER_USERNAME_TAKEN,
                        'Username already taken',
                    );
                    return;
                }

                sendApiError(
                    res,
                    409,
                    AUTH_T_MESSAGES.REGISTER_EMAIL_TAKEN,
                    'Email already registered',
                );
                return;
            }

            throw error;
        }

        try {
            await sendAccountVerificationEmail(user, input.locale);
        } catch {
            await db.user.delete({ where: { id: user.id } });
            sendApiError(
                res,
                500,
                AUTH_T_MESSAGES.REGISTER_EMAIL_SEND_FAILED,
                'Failed to send verification email. Please try again.',
            );
            return;
        }

        const token = signAccessToken(user.id, user.tokenVersion);

        sendApiSuccess(
            res,
            201,
            AUTH_T_MESSAGES.REGISTER_CHECK_EMAIL,
            'Registration successful. Check your email to verify your account.',
            {
                token,
                user: serializeUser(user),
            },
        );
    } catch (error) {
        next(error);
    }
}
