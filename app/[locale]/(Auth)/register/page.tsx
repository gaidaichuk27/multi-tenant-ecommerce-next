import getTranslations from '@/i18n';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { Metadata } from 'next';
import { RegisterView } from '@views/auth/RegisterView';
import { isValidLocale } from '@shared/config/locales/locale';
import { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';
type RegisterPageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: RegisterPageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.register.title'),
        description: t('common:page.register.description'),
    };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;
    const Layouted = WithMainLayout(RegisterView);
    return <Layouted locale={locale} />;
}
