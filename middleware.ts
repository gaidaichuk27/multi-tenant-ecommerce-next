import { NextRequest, NextResponse } from 'next/server';
import { LANG_COOKIE_KEY } from '@shared/config/locales/const';
import {
    buildLocalizedPathname,
    isValidLocale,
} from '@shared/config/locales/locale';
import { Language } from '@shared/config/locales/types';
import i18nConfig from './i18nConfig';

const PUBLIC_PATHS = ['/_next', '/favicon.ico', '/api', '/static'];

function resolveLocale(
    langCookie: string | undefined,
    defaultLocale: Language,
): Language {
    if (langCookie && isValidLocale(langCookie)) {
        return langCookie;
    }

    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathSegments = pathname.split('/');
    const firstSegment = pathSegments[1];
    const hasValidLocale = isValidLocale(firstSegment);
    const defaultLocale = i18nConfig.defaultLocale;

    const cookieStore = request.cookies;
    const langCookie = cookieStore.get(LANG_COOKIE_KEY)?.value;

    const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    if (isPublicPath) return NextResponse.next();

    // Redirect if locale is invalid/missing
    if (!hasValidLocale) {
        const locale = resolveLocale(langCookie, defaultLocale);
        const url = request.nextUrl.clone();
        url.pathname = buildLocalizedPathname(pathname, locale);
        const response = NextResponse.redirect(url);
        response.headers.set('x-current-path', pathname);
        response.cookies.set(LANG_COOKIE_KEY, locale);
        return response;
    }

    // Redirect if locale does not match cookie
    if (
        langCookie &&
        isValidLocale(langCookie) &&
        firstSegment !== langCookie
    ) {
        const url = request.nextUrl.clone();
        url.pathname = buildLocalizedPathname(pathname, langCookie);
        const response = NextResponse.redirect(url);

        response.headers.set('x-current-path', pathname);
        response.cookies.set(LANG_COOKIE_KEY, langCookie);
        return response;
    }

    // Set language cookie if missing
    if (!langCookie) {
        const response = NextResponse.next();
        response.headers.set('x-current-path', pathname);
        response.cookies.set(LANG_COOKIE_KEY, firstSegment);
        return response;
    }

    const response = NextResponse.next();
    response.headers.set('x-current-path', pathname);
    return response;
}

export const config = {
    matcher: ['/', '/((?!api|static|.*\\..*|_next).*)'],
};
