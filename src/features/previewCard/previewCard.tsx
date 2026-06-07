import Link from 'next/link';
import { CSSProperties, ReactNode, isValidElement } from 'react';

import { AppImage } from '@shared/ui/AppImage';
import type { AnimationType, ImageType } from '@shared/config/types';
import { cn } from '@lib/utils';

interface PreviewCardMeta {
    membersCount?: string;
    priceLabel?: string;
}

export interface PreviewCardProps {
    _id: string;
    href: string;
    coverImage: ImageType;
    title: string;
    description: string;
    logo?: ImageType | ReactNode;
    logoAlt?: string;
    meta?: PreviewCardMeta;
    className?: string;
    external?: boolean;
}

interface PreviewCardItem {
    item: PreviewCardProps;
    animation?: AnimationType;
    delay?: number;
}

function isExternalHref(href: string) {
    return href.startsWith('http://') || href.startsWith('https://');
}

function PreviewCardLogo({
    logo,
    logoAlt,
}: Pick<PreviewCardProps, 'logo' | 'logoAlt'>) {
    if (!logo) {
        return null;
    }

    if (isValidElement(logo)) {
        return <div className="preview-card__logo">{logo}</div>;
    }

    return (
        <div className="preview-card__logo">
            <AppImage
                src={logo as ImageType}
                alt={logoAlt ?? ''}
                width={40}
                height={40}
                className="preview-card__logo-image"
            />
        </div>
    );
}

function PreviewCardMeta({ meta }: { meta?: PreviewCardMeta }) {
    if (!meta?.membersCount && !meta?.priceLabel) {
        return null;
    }

    return (
        <div className="preview-card__meta">
            {meta.membersCount && <span>{meta.membersCount} Members</span>}
            {meta.membersCount && meta.priceLabel && (
                <span className="preview-card__meta-separator">•</span>
            )}
            {meta.priceLabel && (
                <span className="preview-card__meta-price">
                    {meta.priceLabel}
                </span>
            )}
        </div>
    );
}

function getCoverImageSrc(coverImage: ImageType) {
    return typeof coverImage === 'string' ? coverImage : coverImage.src;
}

export function PreviewCard({ item, animation, delay }: PreviewCardItem) {
    const isExternal = item.external ?? isExternalHref(item.href);
    const coverStyle = {
        backgroundImage: `url("${getCoverImageSrc(item.coverImage)}")`,
    } as CSSProperties;

    const content = (
        <>
            <div
                className="preview-card__cover"
                style={coverStyle}
            />
            <div className="preview-card__content">
                <div className="preview-card__header">
                    <PreviewCardLogo
                        logo={item.logo}
                        logoAlt={item.logoAlt}
                    />
                    <span className="preview-card__title">{item.title}</span>
                </div>
                <p className="preview-card__description">{item.description}</p>
                <PreviewCardMeta meta={item.meta} />
            </div>
        </>
    );

    if (isExternal) {
        return (
            <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('preview-card', item.className)}
                style={
                    {
                        animationDelay: `${delay}ms`,
                    } as CSSProperties
                }
                data-animation={animation ? animation : false}
                data-delay={delay}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={item.href}
            className={cn('preview-card', item.className)}
            style={
                {
                    animationDelay: `${delay}ms`,
                } as CSSProperties
            }
            data-animation={animation}
            data-delay={delay}
        >
            {content}
        </Link>
    );
}
