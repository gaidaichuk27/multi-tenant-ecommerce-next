import { CSSProperties, memo } from 'react';
import { cn } from '@lib/utils';

interface LegendProps {
    className?: string;
    label?: string;
    color?: boolean;
}

export const Legend = memo(({ className, label, color }: LegendProps) => {
    return (
        <div
            className={cn('legend', className)}
            style={
                {
                    '--gap': label ? '1rem' : 0,
                    '--color': !color ? 'var(--primary)' : 'var(--white)',
                } as CSSProperties
            }
        >
            <div className="legend__line h-1"></div>
            <p className={cn(className)}>{label ? label : ''}</p>
            <div className="legend__line h-1"></div>
        </div>
    );
});

Legend.displayName = 'Legend';
