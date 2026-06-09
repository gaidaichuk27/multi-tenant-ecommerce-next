import type {
    AvailableSearchParams,
    FormFieldProps,
} from '@helpers/searchParams';

export const filterDropdownFieldKeys = [
    'price',
    'type',
    'sort',
    'language',
] as const satisfies readonly AvailableSearchParams[];

export type FilterDropdownFieldKey = (typeof filterDropdownFieldKeys)[number];

export const filterDropdownFields: FormFieldProps = {
    price: {
        items: [
            { id: 'free', label: 'Free' },
            { id: 'paid', label: 'Paid' },
            { id: 'free-trial', label: 'Free trial' },
        ],
        defaultValue: { id: 'free', label: 'Free' },
    },
    type: {
        items: [
            { id: 'private', label: 'Private' },
            { id: 'public', label: 'Public' },
        ],
        defaultValue: { id: 'private', label: 'Private' },
    },
    sort: {
        items: [
            { id: 'trending', label: 'Trending' },
            { id: 'top', label: 'Top' },
        ],
        defaultValue: { id: 'trending', label: 'Trending' },
    },
    language: {
        items: [{ id: 'all', label: 'All' }],
        defaultValue: { id: 'all', label: 'All' },
    },
};
