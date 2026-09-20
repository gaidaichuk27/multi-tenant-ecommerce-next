import type { SvgImport } from '@shared/config/types';
import { Language } from '@repo/api';

export { Language };
export type { StorefrontLocale } from '@repo/api';

export type LanguageLabels = 'Eng' | 'De' | 'Pl' | 'Укр';

export interface LanguageOption {
    label: LanguageLabels;
    value: Language;
    icon: SvgImport;
    preSelected: boolean;
}
