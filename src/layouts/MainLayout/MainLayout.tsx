import { ReactNode } from 'react';
import { Footer } from '@widgets/Footer';
import { Content } from '@widgets/Content';
import { Header } from '@widgets/Header';
import { Container } from '@shared/ui/Container';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';

interface MainLayoutProps {
    className?: string;
    children: ReactNode | ReactNode[];
    withoutContainer: boolean | undefined;
}

export const MainLayout = ({
    className,
    children,
    withoutContainer,
}: MainLayoutProps) => {
    return (
        <div className={cn('flex h-full flex-col', className)}>
            <Header />
            <Content className="grow">
                <Container variant={withoutContainer ? 'secondary' : 'primary'}>
                    {children} <Button>Button</Button>
                </Container>
            </Content>
            <Footer />
            <div id="portal" />
        </div>
    );
};
