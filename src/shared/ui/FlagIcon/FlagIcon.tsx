import Image from 'next/image';

import { cn } from '@lib/utils';
import { getSvgSrc } from '@shared/config/types';
import type { LanguageOption } from '@shared/config/locales/types';

interface FlagIconProps {
    option: LanguageOption;
    className?: string;
}

export function FlagIcon({ option, className }: FlagIconProps) {
    return (
        <Image
            src={getSvgSrc(option.icon)}
            alt={option.label}
            width={24}
            height={24}
            aria-hidden
            unoptimized
            className={cn('shrink-0 rounded-full object-cover', className)}
        />
    );
}
