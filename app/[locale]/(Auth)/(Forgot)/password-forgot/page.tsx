import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { PasswordForgotView } from '@views/auth/PasswordForgotView';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

const i18nNamespaces = ['common'];

type PasswordForgotPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({
    params,
}: PasswordForgotPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.password.forgot.title'),
        description: t('common:page.password.forgot.description'),
    };
}

export default async function PasswordForgotPage({
    params,
}: PasswordForgotPageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;
    const Layouted = WithMainLayout(PasswordForgotView);

    return <Layouted locale={locale} />;
}
