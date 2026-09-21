export { Modals } from './ui/Modals';
export { ConfirmModal } from './ui/ConfirmModal';
export {
    ModalTypes,
    type ConfirmModalContent,
    type ConfirmOptions,
    type ModalDataByType,
} from './model/types/types';
export type { ModalState } from './model/types/modalSchema';
export { ModalProvider, useModal, useModalState } from './model/ModalContext';
