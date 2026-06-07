'use client';
import { getElementSize } from '@helpers/getElementSize';
import { useEffect } from 'react';

const HEADER_HEIGHT_VAR = '--header-height';
const HEADER_POSITION_VAR = '--header-position';
export const setHeaderHeightVariable = (
    height: number,
    node: HTMLElement | null,
) => {
    if (!node) return;
    node.style.setProperty(HEADER_HEIGHT_VAR, `${Math.round(height)}px`);
};
export const setHeaderPositionVariable = (
    position: string,
    node: HTMLElement | null,
) => {
    if (!node) return;
    node.style.setProperty(HEADER_POSITION_VAR, position);
};
export const useStickyHeaderHeight = () => {
    useEffect(() => {
        const elementParams = getElementSize('.js-header');
        const page = document.querySelector<HTMLElement>('.js-page');

        const resizeHandler = () => {
            const elementParams = getElementSize('.js-header');
            if (elementParams && page) {
                setHeaderHeightVariable(
                    elementParams.clientRect.height ?? 0,
                    page,
                );
                setHeaderPositionVariable('absolute', page);
            }
        };

        if (elementParams && page) {
            window.addEventListener('resize', resizeHandler);
            setHeaderHeightVariable(elementParams.clientRect.height ?? 0, page);
            setHeaderPositionVariable('absolute', page);
        }

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);
};
