import { LANG_COOKIE_KEY } from '@shared/config/locales/const';
import { getPreselectedLocale } from '@shared/config/locales/languageOptions';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';

function localeFromCookieHeader(cookieHeader: string | null): Language | null {
    if (!cookieHeader) {
        return null;
    }

    const prefix = `${LANG_COOKIE_KEY}=`;

    for (const part of cookieHeader.split(';')) {
        const trimmed = part.trim();

        if (!trimmed.startsWith(prefix)) {
            continue;
        }

        const value = decodeURIComponent(trimmed.slice(prefix.length).trim());

        if (isValidLocale(value)) {
            return value;
        }
    }

    return null;
}

function localeFromReferer(referer: string | null): Language | null {
    if (!referer) {
        return null;
    }

    try {
        const pathname = new URL(referer).pathname;
        const segment = pathname.split('/').filter(Boolean)[0];
        return isValidLocale(segment) ? segment : null;
    } catch {
        return null;
    }
}

/**
 * Resolve storefront locale for emails from:
 * 1) explicit mutation `locale` (preferred, passed by UI)
 * 2) `slang` cookie
 * 3) `referer` path locale segment
 * 4) LANGUAGE_OPTIONS `preSelected`
 */
export function resolveEmailLocaleFromHeaders(headers: Headers): Language {
    return (
        localeFromCookieHeader(headers.get('cookie')) ??
        localeFromReferer(headers.get('referer')) ??
        getPreselectedLocale()
    );
}
