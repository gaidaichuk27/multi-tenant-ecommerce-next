import { Languages } from '@shared/config/locales/const';
import { getPreselectedLocale } from '@shared/config/locales/languageOptions';

const i18nConfig = {
    locales: [...Languages],
    defaultLocale: getPreselectedLocale(),
};

export default i18nConfig;
