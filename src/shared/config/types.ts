import { StaticImageData } from 'next/image';
import { SVGProps, FC } from 'react';

export type ImageType = string | StaticImageData;

/** Default import shape for `.svg` assets (flags, logos, etc.). */
export type SvgImport =
    | string
    | {
          src: string;
          width?: number;
          height?: number;
      };

export function getSvgSrc(asset: SvgImport): string {
    return typeof asset === 'string' ? asset : asset.src;
}

export type SvgType = FC<SVGProps<SVGSVGElement>> & {
    displayName?: string;
};

interface GridDataDevices {
    desktopWide: number;
    desktop: number;
    tablet: number;
    mobileWide: number;
    mobile: number;
}

export interface GridData {
    gapCol: GridDataDevices;
    gapRow: GridDataDevices;
    columns: GridDataDevices;
}

export enum AnimationType {
    SLIDE_UP_FADE_IN_SLOW = 'slide-up-fade-in-slow',
    FADE_IN = 'fade-in',
    SLIDE_IN_LEFT = 'slide-in-left',
    SLIDE_IN_RIGHT = 'slide-in-right',
    SCALE_IN = 'scale-in',
    BOUNCE_IN = 'bounce-in',
    NONE = 'none',
}
