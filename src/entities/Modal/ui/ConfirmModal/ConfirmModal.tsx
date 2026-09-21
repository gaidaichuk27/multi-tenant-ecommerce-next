'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../model/ModalContext';
import { ModalTypes, type ConfirmModalContent } from '../../model/types/types';
import { Modal } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Form/Button';
import { Typography } from '@shared/ui/Typography';

export function ConfirmModal() {
    const { t } = useTranslation(['common']);
    const { state, cancelConfirm, submitConfirm } = useModal();
    const [isPending, setIsPending] = useState(false);

    const isOpen = state.isOpen && state.type === ModalTypes.confirmAction;
    const data = (isOpen ? state.data : null) as ConfirmModalContent | null;

    // Reset pending when a new confirm session opens (incl. supersede mid-submit).
    useEffect(() => {
        setIsPending(false);
    }, [data]);

    const handleClose = useCallback(() => {
        if (isPending) return;
        cancelConfirm();
    }, [cancelConfirm, isPending]);

    const handleConfirm = useCallback(async () => {
        if (!data || isPending) return;

        setIsPending(true);
        try {
            await submitConfirm();
        } catch {
            // Caller is responsible for toasts; keep modal open on failure.
            setIsPending(false);
        }
    }, [data, isPending, submitConfirm]);

    if (!data) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            dismissible={!isPending}
            width="small"
            title={data.title}
            closeLabel={t('common:modal.close')}
            slotFooter={
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleClose}
                    >
                        {data.cancelLabel ?? t('common:modal.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant={data.destructive ? 'destructive' : 'default'}
                        disabled={isPending}
                        data-modal-initial-focus=""
                        onClick={() => {
                            void handleConfirm();
                        }}
                    >
                        {data.confirmLabel ?? t('common:modal.confirm')}
                    </Button>
                </div>
            }
        >
            {data.description ? (
                <Typography
                    variant="body-2"
                    className="text-muted-foreground"
                >
                    {data.description}
                </Typography>
            ) : null}
        </Modal>
    );
}
