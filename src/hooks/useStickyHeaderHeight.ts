'use client';
import { getElementSize } from '@helpers/getElementSize';
import { useEffect } from 'react';

export const useStickyHeaderHeight = () => {
    useEffect(() => {
        const elementParams = getElementSize('.js-header');
        const page = document.querySelector<HTMLElement>('.js-page');

        const resizeHandler = () => {
            const elementParams = getElementSize('.js-header');
            if (elementParams && page) {
                page.style.paddingTop = `${elementParams?.height.toFixed()}px`;
            }
        };

        if (elementParams && page) {
            window.addEventListener('resize', resizeHandler);
            page.style.paddingTop = `${elementParams?.height.toFixed()}px`;
        }

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);
};
