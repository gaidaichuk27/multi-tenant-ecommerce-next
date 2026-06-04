declare module '*.css';

declare module '*.svg' {
    import type { SvgImport } from '@shared/config/types';

    const content: SvgImport;
    export default content;
}
