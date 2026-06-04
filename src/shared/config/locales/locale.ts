import { Languages } from '@shared/config/locales/const';
import type { AppLocale, FlagIconSource } from '@shared/config/locales/types';

export function isValidLocale(
    segment: string | undefined,
): segment is AppLocale {
    return (
        segment !== undefined &&
        segment !== '' &&
        (Languages as readonly string[]).includes(segment)
    );
}

export function buildLocalizedPathname(
    pathname: string,
    locale: string,
): string {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return `/${locale}`;
    }

    segments[0] = locale;
    return `/${segments.join('/')}`;
}

export function getFlagSrc(icon: FlagIconSource): string {
    return typeof icon === 'string' ? icon : icon.src;
}
