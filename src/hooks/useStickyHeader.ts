'use client';
import { useEffect } from 'react';
import { scrollStickyHeader } from '@helpers/srollStickyHeader';

export const useHeaderSticky = (isSticky: boolean) => {
    useEffect(() => {
        if (isSticky) {
            const updateHeaderVisibility = () => {
                const header =
                    document.querySelector<HTMLElement>('.js-header');
                if (header) {
                    header.classList.remove('m-hidden', 'm-top', 'm-sticky');
                }
            };
            if (typeof window !== 'undefined') {
                window.addEventListener('scroll', scrollStickyHeader);
            }

            updateHeaderVisibility();
        }
        return () => {
            window.removeEventListener('scroll', scrollStickyHeader);
        };
    }, [isSticky]);
};
