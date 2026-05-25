import { ReactNode } from 'react';
import { cn } from '@lib/utils';

interface ContentProps {
    className?: string;
    children: ReactNode | ReactNode[];
}

export const Content = ({ className, children }: ContentProps) => {
    return (
        <main className={cn('flex flex-col items-center', className)}>
            {children}
        </main>
    );
};
