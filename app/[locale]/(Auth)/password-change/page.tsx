import getTranslations from '@/i18n';
import { PasswordChangeView } from '@views/auth/PasswordChangeView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { Metadata } from 'next';

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

export default function PasswordChangePage() {
    const Layouted = WithMainLayout(PasswordChangeView);
    return <Layouted />;
}
