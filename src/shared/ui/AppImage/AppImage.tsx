'use client';

import {
    type ComponentPropsWithoutRef,
    type ReactNode,
    memo,
    useState,
} from 'react';
import Image, { type ImageProps } from 'next/image';
import type { ImageType } from '@shared/config/types';
import fallbackImage from '@images/image-placeholder.jpg';

import { cn } from '@lib/utils';

interface AppImage extends Omit<ImageProps, 'alt' | 'src' | 'lazy'> {
    alt: string;
    src?: ImageType | null;
    className?: string;
    fallback?: ReactNode;
    onLoad?: () => void;
    lazy?: boolean;
}

type AppImageProps = AppImage & ComponentPropsWithoutRef<typeof Image>;

export const AppImage = memo(
    ({
        className,
        alt,
        src,
        fallback,
        width = 0,
        height = 0,
        onError,
        lazy,
        ...imageProps
    }: AppImageProps) => {
        const [error, setError] = useState<boolean>(false);
        const [loaded, setLoaded] = useState<boolean>(false);

        if (!src || error) {
            if (!fallback) {
                return (
                    <Image
                        src={fallbackImage}
                        alt={alt}
                        width={width}
                        height={height}
                        className={cn('fallback', className)}
                        {...imageProps}
                    />
                );
            }
            return <div className={className}>{fallback}</div>;
        }

        if (lazy) {
            return (
                <div className={cn('root', { ['loaded']: loaded })}>
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className={cn('image', className)}
                        onError={(event) => {
                            setError(true);
                            onError?.(event);
                        }}
                        onLoad={() => {
                            setLoaded(true);
                        }}
                        {...imageProps}
                    />
                </div>
            );
        }

        return (
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={cn('image', className)}
                onError={(event) => {
                    setError(true);
                    onError?.(event);
                }}
                onLoad={() => {
                    setLoaded(true);
                }}
                {...imageProps}
            />
        );
    },
);

AppImage.displayName = 'AppImage';
