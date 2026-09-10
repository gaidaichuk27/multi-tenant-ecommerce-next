import rateLimit from 'express-rate-limit';
import { AUTH_T_MESSAGES } from '@repo/api';

const isProduction = process.env.NODE_ENV === 'production';

/** Broad cap across all /api/auth routes. */
export const authRouteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    // Local smoke tests / Fast Refresh can exhaust a tight cap quickly.
    max: isProduction ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        success: false,
        tMessage: AUTH_T_MESSAGES.RATE_LIMITED,
        message: 'Too many requests. Please try again later.',
    },
});

/** Stricter cap for credential / email-sending endpoints. */
export const authSensitiveLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 20 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        success: false,
        tMessage: AUTH_T_MESSAGES.RATE_LIMITED,
        message: 'Too many attempts. Please try again later.',
    },
});
