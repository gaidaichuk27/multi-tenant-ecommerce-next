import type { AppLocale } from '@shared/config/locales/types';

export const Languages = [
    'ua',
    'en',
    'pl',
    'de',
] as const satisfies readonly AppLocale[];

export const LANG_COOKIE_KEY = 'slang';
