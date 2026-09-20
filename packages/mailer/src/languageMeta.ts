import { Language, type StorefrontLocale } from '@repo/api';

/**
 * Storefront locales + which one is initially selected.
 * Values come from `Language` in `@repo/api`.
 */
export const LANGUAGE_META = [
    { value: Language.ENGLISH, preSelected: true },
    { value: Language.UKRAINIAN, preSelected: false },
    { value: Language.POLISH, preSelected: false },
    { value: Language.DEUTSCH, preSelected: false },
] as const satisfies ReadonlyArray<{
    value: Language;
    preSelected: boolean;
}>;

export type { StorefrontLocale };

export function getPreselectedLocale(): StorefrontLocale {
    const option = LANGUAGE_META.find((entry) => entry.preSelected);

    if (!option) {
        throw new Error(
            'LANGUAGE_META must mark exactly one locale as preSelected',
        );
    }

    return option.value;
}
