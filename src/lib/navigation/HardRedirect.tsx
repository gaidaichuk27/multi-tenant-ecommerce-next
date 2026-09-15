'use client';

import { useEffect } from 'react';

/**
 * Full document navigation for auth/membership gates.
 * Soft `redirect()` inside RSC during client transitions can fall back to
 * CSR ("Switched to client rendering") and leave a blank page until reload.
 */
export function HardRedirect({ href }: { href: string }) {
    useEffect(() => {
        window.location.replace(href);
    }, [href]);

    return null;
}
