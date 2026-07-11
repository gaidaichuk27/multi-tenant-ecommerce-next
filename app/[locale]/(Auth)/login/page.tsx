import getTranslations from '@/i18n';
import { LoginView } from '@views/auth/LoginView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { Metadata } from 'next';
import { isValidLocale } from '@shared/config/locales/locale';
import { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

type LoginPageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: LoginPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.login.title'),
        description: t('common:page.login.description'),
    };
}

export default async function LoginPage({ params }: LoginPageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;
    const Layouted = WithMainLayout(LoginView);
    return <Layouted locale={locale} />;
}
