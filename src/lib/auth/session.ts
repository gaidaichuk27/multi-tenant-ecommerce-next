import { cache } from 'react';
import { authMeApiResponseSchema } from '@repo/api';
import { backendFetch, unwrapApiResponseData } from '@lib/backend-client';
import type { User } from '@entities/User';
import { mapUserFromDto } from '@entities/User/model/mappers';

import { JWT_TOKEN_COOKIE_KEY } from '@shared/config/auth';

function readCookieValue(
    cookieHeader: string | null,
    name: string,
): string | null {
    if (!cookieHeader) {
        return null;
    }

    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));

    if (!match?.[1]) {
        return null;
    }

    return decodeURIComponent(match[1]);
}

export function extractBearerToken(headers: Headers): string | null {
    const authorization = headers.get('authorization');

    if (authorization?.startsWith('Bearer ')) {
        return authorization.slice('Bearer '.length);
    }

    if (authorization) {
        return authorization;
    }

    return readCookieValue(headers.get('cookie'), JWT_TOKEN_COOKIE_KEY);
}

/**
 * Server-side session resolution for tRPC context and RSC.
 * Cached per request so Header / banner / `caller.auth.me()` share one `/me` call.
 * Prefer `caller.auth.me()` in server components when you need the user inside tRPC;
 * use this directly only when building auth context outside tRPC (see `createTRPCContext`).
 */
export const getAuthSession = cache(
    async (headers: Headers): Promise<{ user: User } | null> => {
        const token = extractBearerToken(headers);

        if (!token) {
            return null;
        }

        try {
            const response = await backendFetch('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                schema: authMeApiResponseSchema,
            });

            const data = unwrapApiResponseData(response);

            return {
                user: mapUserFromDto(data.user),
            };
        } catch {
            return null;
        }
    },
);
