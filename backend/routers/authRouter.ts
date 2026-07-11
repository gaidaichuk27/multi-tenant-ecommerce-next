import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
    AUTH_T_MESSAGES,
    loginInputSchema,
    registerInputSchema,
    serializeUser,
} from '@repo/api';
import { db } from '@repo/database';
import { sendApiError, sendApiSuccess } from '../lib/api-response';
import { signAccessToken } from '../lib/jwt';
import { requireAuth } from '../middleware/requireAuth';

export const authRouter = Router();

const PASSWORD_SALT_ROUNDS = 12;

authRouter.post('/register', async (req, res, next) => {
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

        const user = await db.user.create({
            data: {
                email: input.email,
                username: input.username,
                name: input.name ?? input.username,
                passwordHash,
            },
        });

        const token = signAccessToken(user.id);

        sendApiSuccess(
            res,
            201,
            AUTH_T_MESSAGES.REGISTER_SUCCESS,
            'Registration successful',
            {
                token,
                user: serializeUser(user),
            },
        );
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', async (req, res, next) => {
    try {
        const input = loginInputSchema.parse(req.body);

        const user = await db.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
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
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.LOGIN_INVALID_CREDENTIALS,
                'Invalid email or password',
            );
            return;
        }

        const token = signAccessToken(user.id);

        sendApiSuccess(
            res,
            200,
            AUTH_T_MESSAGES.LOGIN_SUCCESS,
            'Login successful',
            {
                token,
                user: serializeUser(user),
            },
        );
    } catch (error) {
        next(error);
    }
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.ME_UNAUTHORIZED,
                'Unauthorized',
            );
            return;
        }

        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.ME_USER_NOT_FOUND,
                'User not found',
            );
            return;
        }

        sendApiSuccess(res, 200, AUTH_T_MESSAGES.ME_SUCCESS, 'Session loaded', {
            user: serializeUser(user),
        });
    } catch (error) {
        next(error);
    }
});
