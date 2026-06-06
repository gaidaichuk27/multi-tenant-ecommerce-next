export type ElementSize = {
    clientRect: DOMRect;
    element: Element;
};

export const getElementSize = ($element: string): ElementSize | undefined => {
    if (typeof window === 'undefined') {
        return;
    }

    const node = document.querySelector($element);

    if (!node) {
        return;
    }

    return {
        clientRect: node.getBoundingClientRect(),
        element: node,
    };
};
