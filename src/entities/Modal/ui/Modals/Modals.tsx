'use client';

import type { ReactNode } from 'react';
import { useModalState } from '../../model/ModalContext';
import { ModalTypes } from '../../model/types/types';
import { ConfirmModal } from '../ConfirmModal';

export function Modals() {
    const { isOpen, type } = useModalState();

    const modalsList: Record<ModalTypes, ReactNode> = {
        [ModalTypes.confirmAction]: <ConfirmModal />,
    };

    if (!isOpen || type == null) {
        return null;
    }

    return <>{modalsList[type]}</>;
}
