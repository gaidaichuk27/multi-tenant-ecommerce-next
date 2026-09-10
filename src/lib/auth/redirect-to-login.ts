import { redirect } from 'next/navigation';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';

/**
 * Sends an unauthenticated user to login.
 * Cookie clearing belongs in middleware / route handlers — Server Components
 * cannot call cookies().set() (throws at runtime).
 */
export function redirectToLogin(locale: Language, redirectPath: string): never {
    redirect(
        `${buildLocalizedPathname('/login', locale)}?redirect=${encodeURIComponent(redirectPath)}`,
    );
}
