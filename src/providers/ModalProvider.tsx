'use client';

import type { ReactNode } from 'react';
import { ModalProvider as ModalStateProvider, Modals } from '@entities/Modal';

export function ModalProvider({ children }: { children: ReactNode }) {
    return (
        <ModalStateProvider>
            {children}
            <Modals />
        </ModalStateProvider>
    );
}
