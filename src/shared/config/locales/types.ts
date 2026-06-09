import type { SvgImport } from '@shared/config/types';

export type LanguageLabels = 'Eng' | 'De' | 'Pl' | 'Укр';

export enum Language {
    UKRAINIAN = 'ua',
    ENGLISH = 'en',
    POLISH = 'pl',
    DEUTCH = 'de',
}

export interface LanguageOption {
    label: LanguageLabels;
    value: Language;
    icon: SvgImport;
    preSelected: boolean;
}
