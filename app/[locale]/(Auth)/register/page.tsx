import getTranslations from '@/i18n';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { Metadata } from 'next';
import { RegisterView } from '@views/auth/RegisterView';
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

export default function RegisterPage() {
    const Layouted = WithMainLayout(RegisterView);
    return <Layouted />;
}
