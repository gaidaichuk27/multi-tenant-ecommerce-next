import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { PasswordChangeView } from '@views/auth/PasswordChangeView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { isValidLocale } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import i18nConfig from '@/i18nConfig';

/** Cookie session gate — never serve a static Full Route Cache shell. */
export const dynamic = 'force-dynamic';

type PasswordChangePageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: PasswordChangePageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.password.change.title'),
        description: t('common:page.password.change.description'),
    };
}

export default async function PasswordChangePage({
    params,
}: PasswordChangePageProps) {
    const { locale: localeParam } = await params;
    const locale: Language = isValidLocale(localeParam)
        ? localeParam
        : i18nConfig.defaultLocale;

    const Layouted = WithMainLayout(() => (
        <PasswordChangeView locale={locale} />
    ));

    return <Layouted />;
}
