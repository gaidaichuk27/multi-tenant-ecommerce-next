// TODO: add all available search params and make languages list dynamic

export type AvailableSearchParams =
    | 'filter'
    | 'sort'
    | 'page'
    | 'group'
    | 'community'
    | 'language'
    | 'country'
    | 'price'
    | 'type'
    | 'raiting'
    | 'category';

export type FormFieldItem = {
    id: string;
    label?: string;
};

export type FormFieldConfig = {
    items: FormFieldItem[];
    defaultValue: FormFieldItem;
    value?: FormFieldItem;
};

export type FormFieldProps = Partial<
    Record<AvailableSearchParams, FormFieldConfig>
>;

export interface UrlParamsFromFormProps {
    fields: FormFieldProps;
    url: string;
}

export interface BuildUrlParamsResult {
    params: string;
    shouldUpdate: boolean;
}
