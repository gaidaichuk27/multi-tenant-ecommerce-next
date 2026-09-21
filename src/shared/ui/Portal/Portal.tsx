'use client';

import { type FC, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
}

/**
 * Renders into `document.body`. Distinct from Radix/Vaul portals (Dropdown/Drawer).
 * Body host avoids depending on a `#portal` node that is not always present.
 */
export const Portal: FC<PortalProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(children, document.body);
};
