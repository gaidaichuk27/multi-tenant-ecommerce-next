import { NextRequest, NextResponse } from 'next/server';
import { JWT_TOKEN_COOKIE_KEY } from '@shared/config/auth';
import { LANG_COOKIE_KEY } from '@shared/config/locales/const';
import {
    buildLocalizedPathname,
    isValidLocale,
} from '@shared/config/locales/locale';
import { Language } from '@shared/config/locales/types';
import i18nConfig from './i18nConfig';

const PUBLIC_PATH_PREFIXES = [
    '/_next',
    '/favicon.ico',
    '/api',
    '/static',
] as const;

/** Guest-only routes — logged-in users redirect to /app (SKOOL plan §3.2) */
const PUBLIC_AUTH_ROUTES = [
    '/login',
    '/register',
    '/signup',
    '/password-forgot',
    '/password-restore',
    '/reset-password',
    '/change-password',
    '/verify-email',
] as const;

/** Platform routes that require a session (SKOOL plan §3.3) */
const PROTECTED_ROUTE_PREFIXES = [
    '/app',
    '/backpack',
    '/settings',
    '/chats',
    '/chat',
    '/notifications',
    '/create',
    '/live',
    '/transactions',
    '/logout',
    '/account-onboarding',
    '/password-change',
] as const;

/**
 * Segments after locale that are platform routes, not group slugs.
 * Groups live at /{locale}/{group-slug}/... (SKOOL plan §4).
 */
const RESERVED_PATH_SEGMENTS = new Set([
    ...PUBLIC_AUTH_ROUTES.map((route) => route.slice(1)),
    ...PROTECTED_ROUTE_PREFIXES.map((route) => route.slice(1)),
    'features',
    'pricing',
    'about',
    'discovery',
    'legal',
    'privacy',
    'contact',
    'support',
    'careers',
    'affiliate-program',
    'refer',
    'hormozi',
    'maintenance',
    'health',
    '404',
    's',
    'my-shops',
]);

const AUTH_REDIRECT_PATH = '/app';

function resolveLocale(
    langCookie: string | undefined,
    defaultLocale: Language,
): Language {
    if (langCookie && isValidLocale(langCookie)) {
        return langCookie;
    }

    return defaultLocale;
}

function stripLocalePrefix(pathname: string, locale: Language): string {
    const prefix = `/${locale}`;

    if (pathname === prefix) {
        return '/';
    }

    if (pathname.startsWith(`${prefix}/`)) {
        return pathname.slice(prefix.length) || '/';
    }

    return pathname;
}

function matchesRoutePrefix(
    path: string,
    prefixes: readonly string[],
): boolean {
    return prefixes.some(
        (route) => path === route || path.startsWith(`${route}/`),
    );
}

function resolveGroupSlug(pathAfterLocale: string): string | null {
    const segment = pathAfterLocale.split('/').filter(Boolean)[0];

    if (!segment || RESERVED_PATH_SEGMENTS.has(segment)) {
        return null;
    }

    return segment;
}

function buildRequestHeaders(
    request: NextRequest,
    pathname: string,
    jwtToken: string | undefined,
    groupSlug: string | null,
): Headers {
    const headers = new Headers(request.headers);

    headers.set('x-current-path', pathname);
    headers.set('x-url', request.nextUrl.toString());

    if (groupSlug) {
        headers.set('x-group-slug', groupSlug);
    }

    if (jwtToken) {
        headers.set(
            'authorization',
            jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`,
        );
    }

    return headers;
}

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    if (PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    const firstSegment = pathname.split('/')[1];
    const hasValidLocale = isValidLocale(firstSegment);
    const defaultLocale = i18nConfig.defaultLocale;

    const langCookie = request.cookies.get(LANG_COOKIE_KEY)?.value;
    const jwtToken = request.cookies.get(JWT_TOKEN_COOKIE_KEY)?.value;

    if (!hasValidLocale) {
        const locale = resolveLocale(langCookie, defaultLocale);
        const url = request.nextUrl.clone();
        url.pathname = buildLocalizedPathname(pathname, locale);
        const response = NextResponse.redirect(url);
        response.cookies.set(LANG_COOKIE_KEY, locale);
        return response;
    }

    if (
        langCookie &&
        isValidLocale(langCookie) &&
        firstSegment !== langCookie
    ) {
        const url = request.nextUrl.clone();
        url.pathname = buildLocalizedPathname(pathname, langCookie);
        const response = NextResponse.redirect(url);
        response.cookies.set(LANG_COOKIE_KEY, langCookie);
        return response;
    }

    const locale = firstSegment as Language;
    const pathAfterLocale = stripLocalePrefix(pathname, locale);
    const isAuthRoute = matchesRoutePrefix(pathAfterLocale, PUBLIC_AUTH_ROUTES);
    const isProtectedRoute = matchesRoutePrefix(
        pathAfterLocale,
        PROTECTED_ROUTE_PREFIXES,
    );
    const groupSlug = resolveGroupSlug(pathAfterLocale);

    const requestHeaders = buildRequestHeaders(
        request,
        pathname,
        jwtToken,
        groupSlug,
    );

    if (jwtToken && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${AUTH_REDIRECT_PATH}`;
        return NextResponse.redirect(url);
    }

    if (!jwtToken && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        url.searchParams.set('redirect', `${pathname}${search}`);
        return NextResponse.redirect(url);
    }

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    if (!langCookie) {
        response.cookies.set(LANG_COOKIE_KEY, locale);
    }

    return response;
}

export const config = {
    matcher: ['/', '/((?!api|static|.*\\..*|_next).*)'],
};
