declare module '*.css';

declare module '*.svg' {
    import type { FlagIconSource } from '@/src/shared/config/locales/types';

    const content: FlagIconSource;
    export default content;
}
