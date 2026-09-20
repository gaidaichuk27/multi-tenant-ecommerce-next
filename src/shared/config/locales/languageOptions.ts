import EnFlagIcon from '@shared/assets/icons/flags/flag-uk.svg';
import DeFlagIcon from '@shared/assets/icons/flags/flag-de.svg';
import UaFlagIcon from '@shared/assets/icons/flags/flag-ua.svg';
import PlFlagIcon from '@shared/assets/icons/flags/flag-pl.svg';
import { LANGUAGE_META } from '@repo/mailer/language-meta';
import { Language, type LanguageOption } from '@shared/config/locales/types';
import type { LanguageLabels } from '@shared/config/locales/types';
import type { SvgImport } from '@shared/config/types';

const LOCALE_UI: Record<Language, { label: LanguageLabels; icon: SvgImport }> =
    {
        [Language.ENGLISH]: { label: 'Eng', icon: EnFlagIcon },
        [Language.UKRAINIAN]: { label: 'Укр', icon: UaFlagIcon },
        [Language.POLISH]: { label: 'Pl', icon: PlFlagIcon },
        [Language.DEUTSCH]: { label: 'De', icon: DeFlagIcon },
    };

export const LANGUAGE_OPTIONS: LanguageOption[] = LANGUAGE_META.map((meta) => {
    const ui = LOCALE_UI[meta.value];

    return {
        label: ui.label,
        value: meta.value,
        icon: ui.icon,
        preSelected: meta.preSelected,
    };
});

export function getPreselectedLocale(): Language {
    const option = LANGUAGE_OPTIONS.find((entry) => entry.preSelected);

    if (!option) {
        throw new Error(
            'LANGUAGE_OPTIONS must mark exactly one locale as preSelected',
        );
    }

    return option.value;
}

export function getLanguageOptionByLocale(
    locale: Language,
): LanguageOption | undefined {
    return LANGUAGE_OPTIONS.find((option) => option.value === locale);
}
