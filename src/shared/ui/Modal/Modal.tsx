'use client';

import { memo, useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useBodyOverflow } from '@hooks/useBodyOverflow';
import { cn } from '@lib/utils';
import { Button } from '@shared/ui/Form/Button';
import { Portal } from '@shared/ui/Portal';
import { Typography } from '@shared/ui/Typography';

interface ModalProps {
    children?: ReactNode;
    className?: string;
    title?: string;
    isOpen: boolean;
    width?: 'small' | 'medium' | 'large';
    slotFooter?: ReactNode;
    /** i18n’d close control label (icon button + overlay dismiss). */
    closeLabel?: string;
    /** When false, Escape / backdrop do not dismiss (e.g. pending confirm). */
    dismissible?: boolean;
    onClose?: () => void;
}

const WIDTH_CLASS: Record<NonNullable<ModalProps['width']>, string> = {
    small: 'sm:max-w-md',
    medium: 'sm:max-w-lg',
    large: 'sm:max-w-2xl',
};

function getFocusable(container: HTMLElement) {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
    ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

export const Modal = memo(function Modal({
    children,
    className,
    title = '',
    onClose,
    isOpen = false,
    width = 'medium',
    slotFooter,
    closeLabel = 'Close',
    dismissible = true,
}: ModalProps) {
    const { blockScroll, unBlockScroll } = useBodyOverflow('modal');
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            blockScroll();
        } else {
            unBlockScroll();
        }

        return () => {
            unBlockScroll();
        };
    }, [isOpen, blockScroll, unBlockScroll]);

    useEffect(() => {
        if (!isOpen) return;

        previouslyFocused.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const panel = panelRef.current;
        const focusables = panel ? getFocusable(panel) : [];
        const preferred =
            panel?.querySelector<HTMLElement>('[data-modal-initial-focus]') ??
            null;
        const initial =
            (preferred && focusables.includes(preferred) ? preferred : null) ??
            focusables.find(
                (el) => el.getAttribute('aria-label') !== closeLabel,
            ) ??
            focusables[0] ??
            panel;
        initial?.focus();

        return () => {
            previouslyFocused.current?.focus?.();
        };
    }, [isOpen, closeLabel]);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (dismissible) {
                    event.preventDefault();
                    onClose?.();
                }
                return;
            }

            if (event.key !== 'Tab' || !panelRef.current) return;

            const focusables = getFocusable(panelRef.current);
            if (focusables.length === 0) {
                event.preventDefault();
                panelRef.current.focus();
                return;
            }

            const first = focusables[0]!;
            const last = focusables[focusables.length - 1]!;
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, dismissible, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            <div
                className={cn(
                    'fixed inset-0 z-50 flex items-end justify-center sm:items-center',
                    className,
                )}
                role="presentation"
            >
                <div
                    className="animate-in fade-in-0 fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
                    onClick={() => {
                        if (dismissible) onClose?.();
                    }}
                    aria-hidden
                />
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    tabIndex={-1}
                    className={cn(
                        'bg-popover text-popover-foreground animate-in fade-in-0 slide-in-from-bottom-2 sm:zoom-in-95 fixed z-50 flex max-h-[80vh] w-full flex-col rounded-t-xl border-t text-sm shadow-md outline-none sm:inset-auto sm:bottom-auto sm:max-h-[min(80vh,40rem)] sm:w-[calc(100%-2rem)] sm:rounded-xl sm:border',
                        WIDTH_CLASS[width],
                    )}
                >
                    <div className="bg-muted mx-auto mt-4 h-1 w-[100px] shrink-0 rounded-full sm:hidden" />

                    <div className="relative flex items-start justify-between gap-3 px-4 pt-4 pb-2">
                        {title ? (
                            <Typography
                                id={titleId}
                                variant="title-5"
                                weight={600}
                                className="pr-8"
                            >
                                {title}
                            </Typography>
                        ) : (
                            <span className="flex-1" />
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-3 right-3"
                            aria-label={closeLabel}
                            disabled={!dismissible}
                            onClick={() => onClose?.()}
                        >
                            <X
                                className="size-4"
                                aria-hidden
                            />
                        </Button>
                    </div>

                    <div className="overflow-y-auto px-4 py-2">{children}</div>

                    {slotFooter ? (
                        <div className="mt-auto flex flex-col gap-2 p-4">
                            {slotFooter}
                        </div>
                    ) : null}
                </div>
            </div>
        </Portal>
    );
});
