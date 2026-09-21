export enum ModalTypes {
    confirmAction = 'confirmAction',
}

/** Serializable confirm dialog content (no function fields). */
export interface ConfirmModalContent {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Styles the confirm button as destructive (e.g. delete). */
    destructive?: boolean;
}

/**
 * Options for `confirm()`.
 * `onConfirm` is held in a ref (not React state) so context state stays serializable.
 * Single confirm dialog at a time — opening another cancels the previous as `false`.
 */
export type ConfirmOptions = ConfirmModalContent & {
    /** Optional async work while the modal stays open; rejection keeps it open. */
    onConfirm?: () => void | Promise<void>;
};

export type ModalDataByType = {
    [ModalTypes.confirmAction]: ConfirmModalContent;
};
