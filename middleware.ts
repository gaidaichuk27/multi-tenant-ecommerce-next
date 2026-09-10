import { NextRequest, NextResponse } from 'next/server';
import {
    JWT_TOKEN_COOKIE_KEY,
    getAuthCookieOptions,
} from '@shared/config/auth';
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
    '/verify-email',
] as const;

/**
 * Auth links from email that must work while a session cookie already exists
 * (register auto-login, then click verify / restore from inbox).
 */
const AUTH_ROUTES_ALLOWED_WHILE_LOGGED_IN = [
    '/verify-email',
    '/password-restore',
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

    // Strip purpose tokens from forwarded URL so logs never capture reset/verify JWTs.
    const safeUrl = request.nextUrl.clone();
    safeUrl.searchParams.delete('token');
    headers.set('x-url', safeUrl.toString());

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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const [, payloadSegment] = token.split('.');

        if (!payloadSegment) {
            return null;
        }

        const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(
            normalized.length + ((4 - (normalized.length % 4)) % 4),
            '=',
        );
        const payload = JSON.parse(atob(padded)) as unknown;

        if (typeof payload !== 'object' || payload === null) {
            return null;
        }

        return payload as Record<string, unknown>;
    } catch {
        return null;
    }
}

function peekJwtPurpose(token: string): string | null {
    const payload = decodeJwtPayload(token);
    const purpose = payload?.purpose;

    return typeof purpose === 'string' ? purpose : null;
}

/** Cookie present ≠ valid session — reject purpose tokens and pre-`tv` access JWTs. */
function peekIsAccessSessionCookie(token: string): boolean {
    const payload = decodeJwtPayload(token);

    if (!payload || typeof payload.sub !== 'string') {
        return false;
    }

    if (payload.purpose !== undefined) {
        return false;
    }

    return typeof payload.tv === 'number' && Number.isInteger(payload.tv);
}

/**
 * Shape peek alone is not enough: forged `sub`+`tv` JWTs pass middleware and then
 * `redirect()` inside RSC falls back to CSR ("Switched to client rendering…")
 * instead of an HTTP 307. Confirm with Express `/me` before treating as logged-in.
 */
async function verifyAccessSession(token: string): Promise<boolean> {
    if (!peekIsAccessSessionCookie(token)) {
        return false;
    }

    const backendUrl = resolveBackendUrl();

    try {
        const response = await fetch(`${backendUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        return response.ok;
    } catch {
        return false;
    }
}

function resolveBackendUrl(): string {
    const configured =
        process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

    if (configured) {
        return configured;
    }

    if (process.env.NODE_ENV === 'production') {
        // Fail loudly — silent localhost fallback would redirect every protected
        // page to login with no obvious cause.
        throw new Error(
            'BACKEND_URL (or NEXT_PUBLIC_BACKEND_URL) must be set in production for session verification',
        );
    }

    return 'http://localhost:8080';
}

function clearAuthCookie(response: NextResponse) {
    response.cookies.set(JWT_TOKEN_COOKIE_KEY, '', {
        ...getAuthCookieOptions(),
        maxAge: 0,
    });
}

export async function middleware(request: NextRequest) {
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

    /**
     * Recover email links that previously bounced to /app?token=...
     * (or any non-auth page) by sending them to the correct auth page.
     */
    const purposeToken = request.nextUrl.searchParams.get('token');
    if (
        purposeToken &&
        pathAfterLocale !== '/verify-email' &&
        pathAfterLocale !== '/password-restore'
    ) {
        const purpose = peekJwtPurpose(purposeToken);

        if (purpose === 'email_verify') {
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/verify-email`;
            return NextResponse.redirect(url);
        }

        if (purpose === 'password_reset') {
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/password-restore`;
            return NextResponse.redirect(url);
        }
    }

    const isAuthRouteAllowedWhileLoggedIn = matchesRoutePrefix(
        pathAfterLocale,
        AUTH_ROUTES_ALLOWED_WHILE_LOGGED_IN,
    );
    const hasAccessSession = jwtToken
        ? await verifyAccessSession(jwtToken)
        : false;

    if (hasAccessSession && isAuthRoute && !isAuthRouteAllowedWhileLoggedIn) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${AUTH_REDIRECT_PATH}`;
        url.search = '';
        return NextResponse.redirect(url);
    }

    if (!hasAccessSession && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        url.searchParams.set('redirect', `${pathname}${search}`);
        const response = NextResponse.redirect(url);

        if (jwtToken) {
            clearAuthCookie(response);
        }

        return response;
    }

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    if (jwtToken && !hasAccessSession) {
        clearAuthCookie(response);
    }

    if (!langCookie) {
        response.cookies.set(LANG_COOKIE_KEY, locale);
    }

    return response;
}

export const config = {
    matcher: ['/', '/((?!api|static|.*\\..*|_next).*)'],
};
