import getTranslations from '@/i18n';
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
        title: t('common:page.test.title'),
        description: t('common:page.test.description'),
    };
}

async function Home({ params }: HomePageProps) {
    const { locale } = await params;
    const { t } = await getTranslations(locale, i18nNamespaces);
    return <div>{t('common:page.test.title')}</div>;
}

export default WithMainLayout(Home);
