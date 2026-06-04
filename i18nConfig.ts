import { Languages } from '@shared/config/locales/const';
import { Language } from '@shared/config/locales/types';

const i18nConfig = {
    locales: [...Languages],
    defaultLocale: Language.ENGLISH,
};

export default i18nConfig;
