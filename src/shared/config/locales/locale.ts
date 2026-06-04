import { Languages } from '@shared/config/locales/const';
import { Language } from '@shared/config/locales/types';

export function isValidLocale(
    segment: string | undefined,
): segment is Language {
    return (
        segment !== undefined &&
        segment !== '' &&
        (Languages as readonly Language[]).includes(segment as Language)
    );
}

export function buildLocalizedPathname(
    pathname: string,
    locale: Language,
): string {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return `/${locale}`;
    }

    segments[0] = locale;
    return `/${segments.join('/')}`;
}
