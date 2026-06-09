'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type RefObject,
} from 'react';

const DEFAULT_GAP = 12;
const MORE_BUTTON_SELECTOR = '.filters-row__more';

type UseMoreButtonOptions = {
    gap?: number;
    chipsListSelector?: string;
    trailingSelector?: string;
};

type OverflowTargets = {
    container: HTMLDivElement;
    content: HTMLDivElement;
    chipsList: HTMLElement | null;
    trailing: HTMLElement | null;
    moreButton: HTMLElement | null;
};

function getOverflowTargets(
    containerRef: RefObject<HTMLDivElement | null>,
    contentRef: RefObject<HTMLDivElement | null>,
    chipsListSelector: string,
    trailingSelector: string,
): OverflowTargets | null {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
        return null;
    }

    return {
        container,
        content,
        chipsList: content.querySelector<HTMLElement>(chipsListSelector),
        trailing: container.querySelector<HTMLElement>(trailingSelector),
        moreButton: content.querySelector<HTMLElement>(MORE_BUTTON_SELECTOR),
    };
}

function computeHasOverflow(targets: OverflowTargets, gap: number): boolean {
    const { container, content, chipsList, trailing, moreButton } = targets;

    if (chipsList && trailing) {
        const contentGap =
            parseFloat(getComputedStyle(content).columnGap) || gap;
        const containerGap =
            parseFloat(getComputedStyle(container).columnGap) || gap;
        const moreWidth = moreButton
            ? moreButton.getBoundingClientRect().width + contentGap
            : 0;

        const availableWidth =
            container.clientWidth -
            trailing.getBoundingClientRect().width -
            containerGap -
            moreWidth;

        return chipsList.scrollWidth > availableWidth;
    }

    return content.scrollWidth > container.clientWidth;
}

function observeTargets(
    observer: ResizeObserver,
    observed: Set<Element>,
    targets: OverflowTargets,
) {
    for (const node of [
        targets.container,
        targets.content,
        targets.chipsList,
        targets.trailing,
        targets.moreButton,
    ]) {
        if (node && !observed.has(node)) {
            observer.observe(node);
            observed.add(node);
        }
    }
}

export function useMoreButton(options: UseMoreButtonOptions = {}) {
    const {
        gap = DEFAULT_GAP,
        chipsListSelector = '.chip-filter__list',
        trailingSelector = '.filters-row__dropdown',
    } = options;

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const updateOverflowRef = useRef<() => void>(() => {});
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        const observed = new Set<Element>();

        const update = () => {
            const targets = getOverflowTargets(
                containerRef,
                contentRef,
                chipsListSelector,
                trailingSelector,
            );

            if (!targets) {
                return;
            }

            setHasOverflow(computeHasOverflow(targets, gap));
            observeTargets(observer, observed, targets);
        };

        updateOverflowRef.current = update;

        const observer = new ResizeObserver(update);
        update();

        return () => observer.disconnect();
    }, [chipsListSelector, gap, trailingSelector]);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    useEffect(() => {
        updateOverflowRef.current();
    }, [isExpanded]);

    return {
        containerRef,
        contentRef,
        isExpanded,
        hasOverflow,
        showMoreButton: hasOverflow || isExpanded,
        toggleExpanded,
    };
}
