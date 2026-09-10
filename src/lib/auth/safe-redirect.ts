/**
 * Accept only same-origin relative paths for post-login redirects.
 * Resolves against a dummy origin so browser-style normalization
 * (e.g. `/\evil.example` → off-site) cannot bypass the check.
 */
export function safeRedirect(
    target: string | null | undefined,
    fallback: string,
): string {
    if (!target) {
        return fallback;
    }

    const base = 'https://redirect.invalid';

    try {
        const url = new URL(target, base);

        if (url.origin !== base) {
            return fallback;
        }

        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return fallback;
    }
}
