export const getElementSize = ($element: string): DOMRect | undefined => {
    let elementParams: DOMRect | undefined = undefined;
    if (typeof window !== 'undefined') {
        const node = document.querySelector($element);

        if (node) {
            elementParams = node.getBoundingClientRect();
        }
    }

    return elementParams;
};
