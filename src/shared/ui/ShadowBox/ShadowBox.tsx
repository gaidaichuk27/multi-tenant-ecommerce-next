import { ReactNode } from 'react';

import { cn } from '@lib/utils';

interface ShadowBoxProps {
    children: ReactNode | ReactNode[];
    className?: string;
    width?: number;
    size?: 'small' | 'medium' | 'large';
}

export const ShadowBox = ({
    className,
    size = 'medium',
    children,
}: ShadowBoxProps) => {
    return (
        <div
            data-slot="shadow-box"
            data-size={size}
            className={cn(
                'shadow-box',
                size === 'small' && 'small',
                size === 'medium' && 'medium',
                size === 'large' && 'large',
                className,
            )}
        >
            {children}
        </div>
    );
};
