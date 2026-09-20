import { z } from 'zod';

/** Storefront UI / email locales — single source of truth for API + clients. */
export enum Language {
    UKRAINIAN = 'ua',
    ENGLISH = 'en',
    POLISH = 'pl',
    DEUTSCH = 'de',
}

export const STOREFRONT_LOCALES = [
    Language.UKRAINIAN,
    Language.ENGLISH,
    Language.POLISH,
    Language.DEUTSCH,
] as const satisfies readonly Language[];

export const storefrontLocaleSchema = z.nativeEnum(Language);

export type StorefrontLocale = z.infer<typeof storefrontLocaleSchema>;
