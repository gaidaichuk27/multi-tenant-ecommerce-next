import type { CorsOptions } from 'cors';

function parseOrigins(value: string | undefined): string[] {
    if (!value?.trim()) {
        return [];
    }

    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}

export function getCorsOptions(): CorsOptions {
    const origins = [
        ...parseOrigins(process.env.CORS_ORIGINS),
        process.env.STOREFRONT_URL,
        'http://localhost:3000',
    ].filter((origin): origin is string => Boolean(origin));

    const uniqueOrigins = [...new Set(origins)];

    return {
        origin(origin, callback) {
            if (!origin || uniqueOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(null, false);
        },
    };
}
