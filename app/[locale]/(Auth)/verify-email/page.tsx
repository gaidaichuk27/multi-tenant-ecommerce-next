import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { VerifyEmailView } from '@views/auth/VerifyEmailView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type VerifyEmailPageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: VerifyEmailPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.verify.email.title'),
        description: t('common:page.verify.email.description'),
    };
}

export default async function VerifyEmailPage({
    params,
}: VerifyEmailPageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;
    const Layouted = WithMainLayout(VerifyEmailView);

    return <Layouted locale={locale} />;
}
