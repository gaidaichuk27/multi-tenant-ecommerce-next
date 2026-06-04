import { CSSProperties, ReactNode } from 'react';
import { cn } from '@lib/utils';

interface ContainerProps {
    className?: string;
    children: ReactNode | ReactNode[];
    bgcolor?: 'section-primary-background' | 'section-secondary-background';
    variant?: 'primary' | 'secondary' | 'tertiary';
    fullwidth?: boolean;
    rounded?: boolean;
    lightness?: number;
}

export const Container = ({
    className,
    children,
    bgcolor = 'section-primary-background',
    variant = 'primary',
    fullwidth = false,
    rounded = true,
    lightness = 100,
}: ContainerProps) => {
    return (
        <div
            data-slot="container"
            data-variant={fullwidth ? 'fullwidth' : variant}
            className={cn('container', !fullwidth && variant, className, {
                fullwidth,
                'rounded-[25px]': rounded && !fullwidth,
            })}
            style={
                {
                    '--bg-color': bgcolor,
                    '--lightness': lightness,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
};
