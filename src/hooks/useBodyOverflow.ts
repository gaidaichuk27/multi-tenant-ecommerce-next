import { useCallback, useRef } from 'react';

type BodyOverflowKind = 'modal' | 'drawer' | 'loader';

interface BodyOverflowReturnProps {
    blockScroll: () => void;
    unBlockScroll: () => void;
}

/** Module-level refcounts so nested modal/drawer/loader locks compose safely. */
const lockCounts: Record<BodyOverflowKind, number> = {
    modal: 0,
    drawer: 0,
    loader: 0,
};

function syncBodyOverflowClasses() {
    const total = lockCounts.modal + lockCounts.drawer + lockCounts.loader;

    if (total > 0) {
        document.body.classList.add('scroll-block');
    } else {
        document.body.classList.remove('scroll-block');
    }

    for (const kind of ['modal', 'drawer'] as const) {
        if (lockCounts[kind] > 0) {
            document.body.classList.add(kind);
        } else {
            document.body.classList.remove(kind);
        }
    }
}

export const useBodyOverflow = (
    type: BodyOverflowKind = 'loader',
): BodyOverflowReturnProps => {
    const held = useRef(false);

    const blockScroll = useCallback(() => {
        if (held.current) return;
        held.current = true;
        lockCounts[type] += 1;
        syncBodyOverflowClasses();
    }, [type]);

    const unBlockScroll = useCallback(() => {
        if (!held.current) return;
        held.current = false;
        lockCounts[type] = Math.max(0, lockCounts[type] - 1);
        syncBodyOverflowClasses();
    }, [type]);

    return { blockScroll, unBlockScroll };
};
