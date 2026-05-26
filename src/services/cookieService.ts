import { getCookie, setCookie, getCookies, deleteCookie } from 'cookies-next';
import type { IncomingMessage, ServerResponse } from 'http';
import type { SerializeOptions } from 'cookie';

interface CookieServiceOptions extends SerializeOptions {
    res?: ServerResponse;
    req?: IncomingMessage & {
        cookies?:
            | { [key: string]: string }
            | Partial<{ [key: string]: string }>;
    };
}

export class CookieService {
    private readonly options: CookieServiceOptions;

    constructor(options?: CookieServiceOptions) {
        const isDev = process.env.NODE_ENV === 'development';
        //TODO: set domain name
        const defaultOptions = isDev ? {} : { domain: '' };
        this.options = { ...defaultOptions, ...options };
    }

    get<T extends string | boolean = string>(
        name: string,
        options?: CookieServiceOptions,
    ): T | null {
        const value = getCookie(name, { ...this.options, ...options });
        if (!value) return null;
        return value as T;
    }

    set(name: string, value: unknown, options?: CookieServiceOptions) {
        setCookie(name, value, { ...this.options, ...options });
    }

    getAll(options?: CookieServiceOptions) {
        return getCookies({ ...this.options, ...options });
    }

    delete(name: string, options?: CookieServiceOptions) {
        deleteCookie(name, { ...this.options, ...options });
    }
}

export const cookieService = new CookieService();
