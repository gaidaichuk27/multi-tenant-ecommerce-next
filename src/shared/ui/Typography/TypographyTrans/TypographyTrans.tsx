'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next';

import { cn } from '@lib/utils';
import {
    Typography,
    type TypographyVariants,
} from '@shared/ui/Typography/Typography';

interface TypographyTransProps {
    i18nKey: string;
    variant?: TypographyVariants;
    weight?: 300 | 400 | 500 | 600 | 700;
    color?: string;
    href?: string;
    ns?: string;
    align?: 'left' | 'right' | 'center';
    className?: string;
    linkClassName?: string;
}

export function TypographyTrans({
    i18nKey,
    variant = 'body-1',
    weight = 400,
    color,
    href,
    ns = 'common',
    align = 'left',
    className,
    linkClassName,
}: TypographyTransProps) {
    const params = useParams();
    const locale = params?.locale ?? 'en';

    const localizedHref =
        href &&
        (href.startsWith('/') ? `/${locale}${href}` : `/${locale}/${href}`);

    return (
        <Typography
            variant={variant}
            weight={weight}
            style={color ? { color } : undefined}
            className={cn('[&_a]:cursor-pointer [&_a]:font-bold', className)}
            align={align}
        >
            <Trans
                i18nKey={i18nKey}
                ns={ns}
                components={
                    localizedHref
                        ? {
                              anchor: (
                                  <Link
                                      href={localizedHref}
                                      className={cn(
                                          'text-primary hover:text-primary/80 cursor-pointer font-bold transition-colors',
                                          linkClassName,
                                      )}
                                  />
                              ),
                          }
                        : undefined
                }
            />
        </Typography>
    );
}
