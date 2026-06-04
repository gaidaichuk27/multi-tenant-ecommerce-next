'use client';

import { useMemo, type PropsWithChildren } from 'react';
import { createInstance, type Resource } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18nConfig from '@/i18nConfig';

interface TranslationProviderProps {
    locale: string;
    namespaces: string[];
    resources: Resource;
}

export default function TranslationProvider({
    children,
    locale,
    namespaces,
    resources,
}: PropsWithChildren<TranslationProviderProps>) {
    const i18n = useMemo(() => {
        const instance = createInstance();
        instance.use(initReactI18next);
        instance.init({
            lng: locale,
            resources,
            fallbackLng: i18nConfig.defaultLocale,
            supportedLngs: i18nConfig.locales,
            ns: namespaces,
            defaultNS: namespaces[0],
            fallbackNS: namespaces[0],
            keySeparator: false,
            react: { useSuspense: false },
        });
        return instance;
    }, [locale, namespaces, resources]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
