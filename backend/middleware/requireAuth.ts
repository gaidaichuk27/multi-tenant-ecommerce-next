import type { NextFunction, Request, Response } from 'express';
import { AUTH_T_MESSAGES } from '@repo/api';
import { db, type User } from '@repo/database';
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

async function resolveSessionUser(
    authorizationHeader: string | undefined,
): Promise<User | null> {
    const token = extractBearerToken(authorizationHeader);

    if (!token) {
        return null;
    }

    const session = verifyAccessToken(token);

    if (!session) {
        return null;
    }

    const user = await db.user.findUnique({
        where: { id: session.userId },
    });

    if (!user || user.tokenVersion !== session.tokenVersion) {
        return null;
    }

    return user;
}

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const user = await resolveSessionUser(req.headers.authorization);

        if (!user) {
            sendApiError(
                res,
                401,
                AUTH_T_MESSAGES.ME_UNAUTHORIZED,
                'Unauthorized',
            );
            return;
        }

        req.userId = user.id;
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Sets `req.userId` / `req.user` when a valid Bearer token is present;
 * continues as guest otherwise.
 */
export async function optionalAuth(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    try {
        const user = await resolveSessionUser(req.headers.authorization);

        if (user) {
            req.userId = user.id;
            req.user = user;
        }

        next();
    } catch (error) {
        next(error);
    }
}
