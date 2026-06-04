import { Language } from '@shared/config/locales/types';

export const Languages = [
    Language.UKRAINIAN,
    Language.ENGLISH,
    Language.POLISH,
    Language.DEUTCH,
] as const satisfies readonly Language[];

export const LANG_COOKIE_KEY = 'slang';
