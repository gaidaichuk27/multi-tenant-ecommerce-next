export function getStorefrontUrl(): string {
    return process.env.STOREFRONT_URL ?? 'http://localhost:3000';
}

export function getDefaultLocale(): string {
    return process.env.DEFAULT_LOCALE ?? 'en';
}

export function getEmailConfirmationCouponCode(): string {
    return process.env.EMAIL_CONFIRMATION_COUPON_CODE ?? 'WELCOME20';
}

export function buildStorefrontPath(
    locale: string,
    path: string,
    query?: Record<string, string>,
): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${getStorefrontUrl()}/${locale}${normalizedPath}`);

    if (query) {
        for (const [key, value] of Object.entries(query)) {
            url.searchParams.set(key, value);
        }
    }

    return url.toString();
}
