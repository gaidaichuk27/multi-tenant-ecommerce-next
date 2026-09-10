import { ReactNode } from 'react';
import { Footer } from '@widgets/Footer';
import { Content } from '@widgets/Content';
import { Header } from '@widgets/Header';
import { EmailVerificationBannerServer } from '@widgets/EmailVerificationBanner/EmailVerificationBannerServer';
import { Container } from '@shared/ui/Container';
import { cn } from '@lib/utils';

interface MainLayoutProps {
    className?: string;
    children: ReactNode | ReactNode[];
    withContainer: 'primary' | 'secondary' | 'tertiary' | 'fullwidth';
}

export const MainLayout = ({
    className,
    children,
    withContainer,
}: MainLayoutProps) => {
    return (
        <div className={cn('flex h-full flex-col', className)}>
            <Header />
            <EmailVerificationBannerServer />
            <Content className="grow">
                <Container variant={withContainer}>{children}</Container>
            </Content>
            <Footer />
            <div id="portal" />
        </div>
    );
};
