import { cn } from '@lib/utils';

interface FooterProps {
    className?: string;
}

export const Footer = ({ className }: FooterProps) => {
    return <footer className={cn('footer', className)}>Footer</footer>;
};
