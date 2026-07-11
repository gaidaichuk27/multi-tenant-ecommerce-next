import getTranslations from '@/i18n';
import { isValidLocale } from '@shared/config/locales/locale';
import { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';
import { Metadata } from 'next';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { PasswordRestoreView } from '@views/auth/PasswordRestoreView';

const i18nNamespaces = ['common'];

type PasswordRestorePageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({
    params,
}: PasswordRestorePageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.password.restore.title'),
        description: t('common:page.password.restore.description'),
    };
}

export default async function PasswordRestorePage({
    params,
}: PasswordRestorePageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;
    const Layouted = WithMainLayout(PasswordRestoreView);
    return <Layouted locale={locale} />;
}
