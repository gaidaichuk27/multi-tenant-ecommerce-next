'use client';

import { CSSProperties, Fragment, memo, ReactNode, useMemo } from 'react';
import { cn } from '@lib/utils';

import { AnimationType } from '@shared/config/types';

export enum CardView {
    GRID = 'grid-view',
    LIST = 'list-view',
}

export interface DeviceColumnGridValues {
    mobile?: number;
    mobileWide?: number;
    tablet?: number;
    desktop?: number;
    desktopWide?: number;
}

interface GridProps<T> {
    renderItem: (item: T, animation: AnimationType, delay: number) => ReactNode;
    items: T[];
    view?: CardView;
    className?: string;
    variant?: 'primary' | 'secondary';
    gapRow?: DeviceColumnGridValues;
    gapCol?: DeviceColumnGridValues;
    columns?: DeviceColumnGridValues;
    animation?: AnimationType;
    delay?: number;
}

export const Grid = memo(
    <T,>({
        className,
        renderItem,
        animation = AnimationType.NONE,
        delay = 0,
        view = CardView.GRID,
        items = [],
        variant = 'primary',
        columns = {
            mobile: 1,
            mobileWide: 2,
            tablet: 2,
            desktop: 3,
            desktopWide: 4,
        },
        gapRow = {},
        gapCol = {},
    }: GridProps<T>) => {
        const rowGapStyles = useMemo(
            () => ({
                ...(gapRow.mobile && {
                    '--grid-row-gap': `${gapRow.mobile}px`,
                }),
                ...(gapRow.mobileWide && {
                    '--grid-row-gap-mobile-wide': `${gapRow.mobileWide}px`,
                }),
                ...(gapRow.tablet && {
                    '--grid-row-gap-tablet': `${gapRow.tablet}px`,
                }),
                ...(gapRow.desktop && {
                    '--grid-row-gap-desktop': `${gapRow.desktop}px`,
                }),
                ...(gapRow.desktopWide && {
                    '--grid-row-gap-desktop-wide': `${gapRow.desktopWide}px`,
                }),
            }),
            [
                gapRow,
                gapRow.mobile,
                gapRow.tablet,
                gapRow.desktop,
                gapRow.desktopWide,
            ],
        );

        const columnGapStyles = useMemo(
            () => ({
                ...(gapCol.mobile && {
                    '--grid-column-gap': `${gapCol.mobile}px`,
                }),
                ...(gapCol.mobileWide && {
                    '--grid-column-gap-mobile-wide': `${gapCol.mobileWide}px`,
                }),
                ...(gapCol.tablet && {
                    '--grid-column-gap-tablet': `${gapCol.tablet}px`,
                }),
                ...(gapCol.desktop && {
                    '--grid-column-gap-desktop': `${gapCol.desktop}px`,
                }),
                ...(gapCol.desktopWide && {
                    '--grid-column-gap-desktop-wide': `${gapCol.desktopWide}px`,
                }),
            }),
            [
                gapCol,
                gapCol.mobile,
                gapCol.tablet,
                gapCol.desktop,
                gapCol.desktopWide,
            ],
        );

        const columnQtyStyles = useMemo(
            () => ({
                ...(columns.mobile && { '--grid-columns-qty': columns.mobile }),
                ...(columns.mobileWide && {
                    '--grid-columns-qty-mobile-wide': columns.mobileWide,
                }),
                ...(columns.tablet && {
                    '--grid-columns-qty-tablet': columns.tablet,
                }),
                ...(columns.desktop && {
                    '--grid-columns-qty-desktop': columns.desktop,
                }),
                ...(columns.desktopWide && {
                    '--grid-columns-qty-desktop-wide': columns.desktopWide,
                }),
            }),
            [
                columns,
                columns.mobile,
                columns.tablet,
                columns.desktop,
                columns.desktopWide,
            ],
        );

        if (!items || items.length === 0) {
            return null;
        }

        return (
            <div className={cn('grid-layout', [variant], className)}>
                <div
                    className={cn('grid-inner', [view])}
                    style={
                        {
                            ...rowGapStyles,
                            ...columnGapStyles,
                            ...columnQtyStyles,
                        } as CSSProperties
                    }
                >
                    {items.map((item, index) => (
                        <Fragment key={index}>
                            {renderItem(item, animation, delay * index)}
                        </Fragment>
                    ))}
                </div>
            </div>
        );
    },
);

Grid.displayName = 'Grid';
