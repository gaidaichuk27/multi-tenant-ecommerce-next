'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { cn } from '@lib/utils';
import { getSvgSrc, type SvgImport } from '@shared/config/types';
import logoSrc from '@images/logo.svg';

const LOGO_VIEWBOX_WIDTH = 269.55760076208276;
const LOGO_VIEWBOX_HEIGHT = 94;
const LOGO_DISPLAY_HEIGHT = 40;
const LOGO_DISPLAY_WIDTH = Math.round(
    LOGO_DISPLAY_HEIGHT * (LOGO_VIEWBOX_WIDTH / LOGO_VIEWBOX_HEIGHT),
);

interface LogoProps {
    className?: string;
    src?: SvgImport;
}

export function Logo({ className, src = logoSrc }: LogoProps) {
    const params = useParams();
    const locale = params?.locale ?? 'en';

    return (
        <Link
            href={`/${locale}`}
            aria-label="Home"
            className="inline-flex shrink-0"
        >
            <Image
                src={getSvgSrc(src)}
                alt="Logo"
                width={LOGO_DISPLAY_WIDTH}
                height={LOGO_DISPLAY_HEIGHT}
                priority
                unoptimized
                className={cn('h-14 shrink-0 dark:invert', className)}
            />
        </Link>
    );
}
