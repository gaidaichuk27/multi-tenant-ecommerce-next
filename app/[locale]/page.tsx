import { WithMainLayout } from '@hocs/WithMainLayout';

type HomePageProps = {
    params: Promise<{ locale: string }>;
};

function Home(_: HomePageProps) {
    return <div>home</div>;
}

export default WithMainLayout(Home);
