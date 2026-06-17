import getTranslations from '@/i18n';
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

export default function PasswordRestorePage() {
    const Layouted = WithMainLayout(PasswordRestoreView);
    return <Layouted />;
}
