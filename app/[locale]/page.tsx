import type { Metadata } from 'next';
import getTranslations from '@/i18n';
import { HomeView } from '@views/HomeView';
import { WithMainLayout } from '@hocs/WithMainLayout';
import { HydrateClient, getQueryClient, trpc } from '@TRPC/server';
import { ClientGreeting } from '@features/greeting';
import { ClientTestUsers, ServerTestUsers } from '@features/testUsers';

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

    const greeting = await queryClient.fetchQuery(
        trpc.greeting.sayHello.queryOptions(),
    );
    const serverHello = greeting[0]?.hello;

    void queryClient.prefetchQuery(trpc.users.list.queryOptions());

    const Layouted = WithMainLayout(HomeView);
    return (
        <HydrateClient>
            {serverHello && (
                <p data-testid="server-greeting">
                    Greeting (server): {serverHello}
                </p>
            )}
            <ClientGreeting />
            <ServerTestUsers />
            <ClientTestUsers />
            <Layouted />
        </HydrateClient>
    );
}
