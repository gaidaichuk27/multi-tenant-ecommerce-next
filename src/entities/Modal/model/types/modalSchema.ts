import type { ModalTypes } from './types';
import type { ModalDataByType } from './types';

export interface ModalState {
    isOpen: boolean;
    type: ModalTypes | null;
    data: ModalDataByType[ModalTypes] | null;
}
