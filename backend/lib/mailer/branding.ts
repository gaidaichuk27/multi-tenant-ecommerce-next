import {
    buildStorefrontPath,
    getDefaultLocale,
    getStorefrontUrl,
} from './config';

export const APP_NAME = 'Multi-Tenant Ecommerce';

function getStorefrontHostname(): string {
    try {
        return new URL(getStorefrontUrl()).hostname;
    } catch {
        return 'localhost';
    }
}

function getSupportEmail(): string {
    return (
        process.env.SUPPORT_EMAIL ??
        process.env.MAILER_ADDRESS ??
        'support@example.com'
    );
}

function stripTrailingSlash(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Rewrites mealstogo placeholders and hardcoded storefront links
 * to locale-aware Multi-Tenant Ecommerce URLs.
 *
 * Important: only replace exact `href="http://localhost:3000"` links.
 * Do not replace every occurrence of the storefront origin — CTA links
 * (verify / password-restore) are already locale-aware and would become
 * `/ua/ua/...` if the origin were replaced blindly.
 */
export function applyEmailBranding(html: string, locale?: string): string {
    const resolvedLocale = locale ?? getDefaultLocale();
    const homeUrl = stripTrailingSlash(
        buildStorefrontPath(resolvedLocale, '/'),
    );
    const categoriesUrl = stripTrailingSlash(
        buildStorefrontPath(resolvedLocale, '/categories'),
    );
    const storefrontHostname = getStorefrontHostname();
    const supportEmail = getSupportEmail();

    return html
        .replaceAll(
            'href="http://localhost:3000/categories"',
            `href="${categoriesUrl}"`,
        )
        .replaceAll('href="http://localhost:3000"', `href="${homeUrl}"`)
        .replaceAll('https://MEALSTOGO.com', homeUrl)
        .replaceAll('MEALSTOGO', APP_NAME)
        .replaceAll('help@mealstogo.com', supportEmail)
        .replaceAll('mealstogo.com', storefrontHostname);
}
