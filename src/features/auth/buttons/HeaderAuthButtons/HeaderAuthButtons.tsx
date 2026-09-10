'use client';

import { memo } from 'react';
import { cn } from '@lib/utils';
import { ActionButton } from '../ActionButton';

interface HeaderAuthButtonsProps {
    className?: string;
    direction?: 'row' | 'col';
}

export const HeaderAuthButtons = memo(
    ({ className, direction = 'row' }: HeaderAuthButtonsProps) => (
        <div
            className={cn(
                'flex items-center gap-1.5',
                direction === 'col' && 'w-full flex-col items-stretch',
                className,
            )}
        >
            <ActionButton
                title="common:form.button.signin"
                route="/login"
                variant={{ variant: 'outline', size: 'default' }}
                className={cn(
                    '!mr-0 !mb-0 h-10 min-w-0 px-3',
                    direction === 'col' && 'w-full',
                )}
            />
            <ActionButton
                title="common:form.button.register"
                route="/register"
                variant={{ variant: 'default', size: 'default' }}
                className={cn(
                    '!mr-0 !mb-0 h-10 min-w-0 px-3',
                    direction === 'col' && 'w-full',
                )}
            />
        </div>
    ),
);

HeaderAuthButtons.displayName = 'HeaderAuthButtons';
