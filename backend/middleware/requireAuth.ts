import type { NextFunction, Request, Response } from 'express';
import { AUTH_T_MESSAGES } from '@repo/api';
import { verifyAccessToken } from '../lib/jwt';
import { sendApiError } from '../lib/api-response';

function extractBearerToken(
    authorizationHeader: string | undefined,
): string | null {
    if (!authorizationHeader) {
        return null;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }

    return token;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        sendApiError(res, 401, AUTH_T_MESSAGES.ME_UNAUTHORIZED, 'Unauthorized');
        return;
    }

    const session = verifyAccessToken(token);

    if (!session) {
        sendApiError(
            res,
            401,
            AUTH_T_MESSAGES.ME_UNAUTHORIZED,
            'Invalid or expired token',
        );
        return;
    }

    req.userId = session.userId;
    next();
}

/**
 * Sets `req.userId` when a valid Bearer token is present; continues as guest otherwise.
 * Use on routes that behave differently for signed-in users but do not require auth.
 * (Not wired yet — first consumer expected in Phase 1 public group pages.)
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        next();
        return;
    }

    const session = verifyAccessToken(token);

    if (session) {
        req.userId = session.userId;
    }

    next();
}
