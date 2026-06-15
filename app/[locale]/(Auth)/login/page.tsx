import getTranslations from '@/i18n';
import { LoginView } from '@views/auth/LoginView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { Metadata } from 'next';

type HomePageProps = {
    params: Promise<{ locale: string }>;
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
    params,
}: HomePageProps): Promise<Metadata> {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);

    return {
        title: t('common:page.login.title'),
        description: t('common:page.login.description'),
    };
}

export default function Home() {
    const Layouted = WithMainLayout(LoginView);
    return <Layouted />;
}
