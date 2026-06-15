import getTranslations from '@/i18n';
import { HomeView } from '@views/HomeView';
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
        title: t('common:page.home.title'),
        description: t('common:page.home.description'),
    };
}

export default function Home() {
    const Layouted = WithMainLayout(HomeView);
    return <Layouted />;
}
