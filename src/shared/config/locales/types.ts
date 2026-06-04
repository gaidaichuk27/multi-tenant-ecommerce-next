import { FC, SVGProps } from 'react';

export type SvgType = FC<SVGProps<SVGSVGElement>> & {
    displayName?: string;
};

/** Next.js default import shape for `.svg` assets. */
export type FlagIconSource =
    | string
    | {
          src: string;
          width?: number;
          height?: number;
      };

export type LanguageLabels = 'Eng' | 'De' | 'Pl' | 'Укр';

export enum Language {
    UKRAINIAN = 'ua',
    ENGLISH = 'en',
    POLISH = 'pl',
    DEUTCH = 'de',
}

export type AppLocale = 'ua' | 'en' | 'pl' | 'de';

export interface LanguageOption {
    label: LanguageLabels;
    value: AppLocale;
    icon: FlagIconSource;
    preSelected: boolean;
}
