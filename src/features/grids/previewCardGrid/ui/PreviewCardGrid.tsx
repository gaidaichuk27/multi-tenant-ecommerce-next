'use client';
import { memo } from 'react';
import {
    PreviewCard,
    type PreviewCardProps,
} from '@features/previewCard/previewCard';
import { previewCardGridConfig } from '../model/types';
import { Grid } from '@shared/ui/Grid';
import { AnimationType } from '@shared/config/types';

import { cn } from '@lib/utils';

interface PreviewCardGridProps {
    className?: string;
    items: PreviewCardProps[];
    animation?: AnimationType;
    delay?: number;
}

export const PreviewCardGrid = memo(
    ({ className, items, animation, delay }: PreviewCardGridProps) => {
        return (
            <div className={cn('w-full px-4 lg:px-8', className)}>
                <Grid
                    items={items}
                    gapCol={previewCardGridConfig.gapCol}
                    gapRow={previewCardGridConfig.gapRow}
                    columns={previewCardGridConfig.columns}
                    animation={animation}
                    delay={delay}
                    renderItem={(item, animation, delay) => (
                        <PreviewCard
                            item={item as PreviewCardProps}
                            animation={animation}
                            delay={delay}
                        />
                    )}
                />
            </div>
        );
    },
);

PreviewCardGrid.displayName = 'PreviewCardGrid';
