import { headers } from 'next/headers';
import { Language } from '@shared/config/locales/types';

export const getCurrentLangFromPathname = async (): Promise<Language> => {
    const headersList = await headers();
    const pathname = headersList.get('x-current-path');

    return pathname?.split('/')[1] as Language;
};
