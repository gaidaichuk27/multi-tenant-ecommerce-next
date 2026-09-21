'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import type { ModalState } from './types/modalSchema';
import {
    ModalTypes,
    type ConfirmOptions,
    type ModalDataByType,
} from './types/types';

type PendingConfirm = {
    resolve: (value: boolean) => void;
    onConfirm?: () => void | Promise<void>;
};

interface ModalContextValue {
    state: ModalState;
    /**
     * Opens the confirm dialog. Resolves `true` after successful confirm
     * (and `onConfirm` if provided), or `false` if cancelled / superseded.
     * Only one confirm at a time.
     */
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    /** Cancel open confirm (Escape / backdrop / Cancel). */
    cancelConfirm: () => void;
    /** Run optional `onConfirm` work, then resolve `true` and close. */
    submitConfirm: () => Promise<void>;
}

const initialState: ModalState = {
    isOpen: false,
    type: null,
    data: null,
};

const ModalContext = createContext<ModalContextValue | null>(null);

function settlePending(
    pendingRef: React.MutableRefObject<PendingConfirm | null>,
    expected: PendingConfirm | null,
    value: boolean,
    setState: (state: ModalState) => void,
) {
    // Only settle the entry we started with — ignore if superseded mid-flight.
    if (expected == null || pendingRef.current !== expected) {
        return false;
    }

    pendingRef.current = null;
    setState(initialState);
    expected.resolve(value);
    return true;
}

export function ModalProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ModalState>(initialState);
    const pendingRef = useRef<PendingConfirm | null>(null);

    const cancelConfirm = useCallback(() => {
        const pending = pendingRef.current;
        if (!pending) {
            setState(initialState);
            return;
        }
        settlePending(pendingRef, pending, false, setState);
    }, []);

    const confirm = useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            // Supersede any in-flight confirm (including one awaiting onConfirm).
            pendingRef.current?.resolve(false);

            pendingRef.current = {
                resolve,
                onConfirm: options.onConfirm,
            };

            setState({
                isOpen: true,
                type: ModalTypes.confirmAction,
                data: {
                    title: options.title,
                    description: options.description,
                    confirmLabel: options.confirmLabel,
                    cancelLabel: options.cancelLabel,
                    destructive: options.destructive,
                } satisfies ModalDataByType[ModalTypes.confirmAction],
            });
        });
    }, []);

    const submitConfirm = useCallback(async () => {
        const pending = pendingRef.current;
        if (!pending) return;

        try {
            if (pending.onConfirm) {
                await pending.onConfirm();
            }
        } catch (error) {
            // Keep this dialog open only if it is still current.
            if (pendingRef.current === pending) {
                throw error;
            }
            return;
        }

        settlePending(pendingRef, pending, true, setState);
    }, []);

    const value = useMemo(
        () => ({ state, confirm, cancelConfirm, submitConfirm }),
        [state, confirm, cancelConfirm, submitConfirm],
    );

    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
}

export function useModal(): ModalContextValue {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return ctx;
}

export function useModalState() {
    return useModal().state;
}
