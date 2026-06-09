import {
    BuildUrlParamsResult,
    FormFieldConfig,
    FormFieldItem,
    UrlParamsFromFormProps,
} from './types';

const getQueryString = (urlOrQuery: string) => {
    if (!urlOrQuery) {
        return '';
    }

    return urlOrQuery.includes('?')
        ? (urlOrQuery.split('?')[1] ?? '')
        : urlOrQuery;
};

export const getUrlParamsFromUrl = (urlOrQuery: string) => {
    const query = getQueryString(urlOrQuery);

    if (!query) {
        return {};
    }

    const params = new URLSearchParams(query);
    return Object.fromEntries(params.entries());
};

export const getAppliedFieldItem = (
    field: FormFieldConfig,
    urlValue: string | null,
): FormFieldItem => {
    if (urlValue) {
        const found = field.items.find((item) => item.id === urlValue);

        if (found) {
            return found;
        }

        return { id: urlValue };
    }

    return field.defaultValue;
};

export const buildUrlParamsFromFormFields = ({
    fields,
    url,
}: UrlParamsFromFormProps): BuildUrlParamsResult => {
    const currentParams = getQueryString(url);
    const params = new URLSearchParams(currentParams);

    for (const fieldKey of Object.keys(fields)) {
        const field = fields[fieldKey as keyof typeof fields];

        if (!field?.value) {
            continue;
        }

        if (field.value.id === field.defaultValue.id) {
            params.delete(fieldKey);
            continue;
        }

        params.set(fieldKey, field.value.id);
    }

    const nextParams = params.toString();

    return {
        params: nextParams,
        shouldUpdate: nextParams !== currentParams,
    };
};
