import { cookies } from 'next/headers';
import { caller } from '@TRPC/server';
import { redirectToLogin } from '@lib/auth/redirect-to-login';
import type { Language } from '@shared/config/locales/types';
import type { User } from '@entities/User';

/**
 * Server-side session gate for protected views.
 * Middleware only peeks JWT shape — this calls /me and redirects if invalid.
 */
export async function requireAuthSession(
    locale: Language,
    redirectPath: string,
): Promise<User> {
    // Opt out of Full Route Cache: forged/shape-only cookies must not
    // receive a prerendered /app shell (middleware peeks JWT shape only).
    await cookies();

    const user = await caller.auth.me();

    if (!user) {
        redirectToLogin(locale, redirectPath);
    }

    return user;
}
