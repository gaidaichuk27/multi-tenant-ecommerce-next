import getTranslations from '@/i18n';
import { HomeView } from '@views/HomeView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { Metadata } from 'next';
import { HydrateClient, getQueryClient, trpc } from '@TRPC/server';
import { ClientGreeting } from '@features/greeting';

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

export default async function Home() {
    const queryClient = getQueryClient();
    const sayHello = trpc.greeting.sayHello;
    const greeting = await queryClient.fetchQuery(sayHello.queryOptions());
    const serverHello = greeting[0]?.hello;

    const Layouted = WithMainLayout(HomeView);
    return (
        <HydrateClient>
            {serverHello && (
                <p data-testid="server-greeting">
                    Greeting (server): {serverHello}
                </p>
            )}
            <ClientGreeting />
            <Layouted />
        </HydrateClient>
    );
}
