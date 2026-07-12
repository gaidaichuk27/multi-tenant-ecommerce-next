'use client';

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';
import { useTheme } from 'next-themes';

export function Toaster({
    position = 'top-right',
    richColors = true as const,
    duration = 3000,
    closeButton = true,
}: Partial<ToasterProps>) {
    const { resolvedTheme } = useTheme();

    return (
        <SonnerToaster
            theme={resolvedTheme as ToasterProps['theme']}
            position={position}
            richColors={richColors}
            duration={duration}
            closeButton={closeButton}
        />
    );
}
