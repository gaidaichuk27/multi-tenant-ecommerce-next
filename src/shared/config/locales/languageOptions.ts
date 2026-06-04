import EnFlagIcon from '@shared/assets/icons/flags/flag-uk.svg';
import DeFlagIcon from '@shared/assets/icons/flags/flag-de.svg';
import UaFlagIcon from '@shared/assets/icons/flags/flag-ua.svg';
import PlFlagIcon from '@shared/assets/icons/flags/flag-pl.svg';
import { Language, type LanguageOption } from '@shared/config/locales/types';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    {
        label: 'Eng',
        value: Language.ENGLISH,
        icon: EnFlagIcon,
        preSelected: true,
    },
    {
        label: 'Укр',
        value: Language.UKRAINIAN,
        icon: UaFlagIcon,
        preSelected: false,
    },
    {
        label: 'Pl',
        value: Language.POLISH,
        icon: PlFlagIcon,
        preSelected: false,
    },
    {
        label: 'De',
        value: Language.DEUTCH,
        icon: DeFlagIcon,
        preSelected: false,
    },
];

export function getLanguageOptionByLocale(
    locale: Language,
): LanguageOption | undefined {
    return LANGUAGE_OPTIONS.find((option) => option.value === locale);
}
