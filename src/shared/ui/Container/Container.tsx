import { ReactNode } from 'react';
import { cn } from '@lib/utils';

interface ContainerProps {
    className?: string;
    children: ReactNode | ReactNode[];
    secondary?: boolean;
}

export const Container = ({
    className,
    children,
    secondary = false,
}: ContainerProps) => {
    return (
        <div
            className={cn(className, {
                ['m-secondary']: secondary,
            })}
        >
            {children}
        </div>
    );
};
