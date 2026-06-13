import {
    type ComponentProps,
    type CSSProperties,
    type ElementType,
    type ReactNode,
    useMemo,
} from 'react';

import { cn } from '@lib/utils';
import { AnimationType } from '@/src/shared/config/types';

export type TypographyVariants =
    | 'title-1'
    | 'title-2'
    | 'title-3'
    | 'title-4'
    | 'title-5'
    | 'title-6'
    | 'body-1'
    | 'body-2'
    | 'body-3'
    | 'label';

interface TypographyOwnProps<E extends ElementType = ElementType> {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    variant?: TypographyVariants;
    underlined?: boolean;
    align?: 'left' | 'right' | 'center';
    weight?: 300 | 400 | 500 | 600 | 700;
    as?: E;
    'data-animation'?: AnimationType;
}

type TypographyProps<E extends ElementType> = TypographyOwnProps<E> &
    Omit<ComponentProps<E>, keyof TypographyOwnProps>;

export const Typography = <E extends ElementType = ElementType>(
    props: TypographyProps<E>,
) => {
    const {
        as,
        children,
        variant = 'body-1',
        className,
        style,
        underlined,
        align = 'left',
        weight = 400,
        ...rest
    } = props;

    const Component = useMemo(() => {
        if (as) return as;
        switch (variant) {
            case 'title-1':
                return 'h1';
            case 'title-2':
                return 'h2';
            case 'title-3':
                return 'h3';
            case 'title-4':
                return 'h4';
            case 'title-5':
                return 'h5';
            case 'title-6':
                return 'h6';
            case 'label':
                return 'label';
            default:
                return 'p';
        }
    }, [variant, as]);

    const getStyle = () => {
        const result: CSSProperties & {
            '--color'?: string;
            '--text-decoration'?: 'underline' | 'none';
            '--text-align'?: 'left' | 'right' | 'center';
            '--font-weight'?: number;
        } = {
            ...style,
        };

        if (style?.color) {
            result['--color'] = style.color as string;
            delete result.color;
        }

        result['--text-decoration'] = underlined ? 'underline' : 'none';
        result['--text-align'] = align;
        if (weight) {
            result['--font-weight'] = weight;
        }
        return result;
    };
    const typographyStyles = getStyle();
    return (
        <Component
            style={typographyStyles as CSSProperties}
            className={cn('typography', [variant], className)}
            {...rest}
        >
            {children}
        </Component>
    );
};
