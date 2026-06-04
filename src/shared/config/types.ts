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
