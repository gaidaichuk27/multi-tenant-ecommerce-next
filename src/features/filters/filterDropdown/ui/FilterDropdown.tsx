'use client';

import { useCallback, useMemo, useState } from 'react';
import {
    usePathname,
    useRouter,
    useSearchParams as useRouterSearchParams,
} from 'next/navigation';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

import { cn } from '@lib/utils';
import {
    buildUrlParamsFromFormFields,
    getAppliedFieldItem,
} from '@helpers/searchParams';
import type {
    AvailableSearchParams,
    FormFieldItem,
    FormFieldProps,
} from '@helpers/searchParams';
import { Button } from '@shared/ui/Form/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@shared/ui/Form/Dropdown';
import { Label } from '@shared/ui/Form/Label';
import { RadioGroup, RadioGroupItem } from '@shared/ui/Form/RadioGroup';
import {
    filterDropdownFieldKeys,
    filterDropdownFields,
    type FilterDropdownFieldKey,
} from '../mock/filterOptions';

const FILTER_COLUMN_KEYS = filterDropdownFieldKeys.filter(
    (key) => key !== 'language',
);

const FILTER_COLUMN_TITLES: Record<FilterDropdownFieldKey, string> = {
    price: 'Price',
    type: 'Type',
    sort: 'Sort',
    language: 'Language',
};

type DraftValues = Partial<Record<FilterDropdownFieldKey, FormFieldItem>>;

interface FilterDropdownProps {
    className?: string;
    fields?: FormFieldProps;
    extraFields?: FormFieldProps;
}

function buildDraftFromUrl(
    fields: FormFieldProps,
    keys: readonly FilterDropdownFieldKey[],
    getUrlValue: (key: AvailableSearchParams) => string | null,
): DraftValues {
    const draft: DraftValues = {};

    for (const key of keys) {
        const field = fields[key];

        if (!field) {
            continue;
        }

        draft[key] = getAppliedFieldItem(field, getUrlValue(key));
    }

    return draft;
}

function buildFieldsWithValues(
    fields: FormFieldProps,
    keys: readonly FilterDropdownFieldKey[],
    draft: DraftValues,
): FormFieldProps {
    const nextFields: FormFieldProps = {};

    for (const key of keys) {
        const field = fields[key];
        const draftItem = draft[key];

        if (!field || !draftItem) {
            continue;
        }

        nextFields[key] = {
            ...field,
            value: draftItem,
        };
    }

    return nextFields;
}

function isDraftMatchingUrl(
    fields: FormFieldProps,
    keys: readonly FilterDropdownFieldKey[],
    draft: DraftValues,
    getUrlValue: (key: AvailableSearchParams) => string | null,
): boolean {
    return keys.every((key) => {
        const field = fields[key];
        const draftItem = draft[key];

        if (!field || !draftItem) {
            return true;
        }

        const appliedItem = getAppliedFieldItem(field, getUrlValue(key));

        return draftItem.id === appliedItem.id;
    });
}

export function FilterDropdown({
    className,
    fields = filterDropdownFields,
    extraFields,
}: FilterDropdownProps) {
    const router = useRouter();
    const pathname = usePathname();
    const routerSearchParams = useRouterSearchParams();
    const currentQuery = routerSearchParams.toString();

    const getUrlValue = useCallback(
        (key: AvailableSearchParams) => routerSearchParams.get(key),
        [routerSearchParams],
    );

    const appliedDraft = useMemo(
        () => buildDraftFromUrl(fields, filterDropdownFieldKeys, getUrlValue),
        [fields, getUrlValue],
    );

    const [draft, setDraft] = useState<DraftValues>(appliedDraft);
    const [isOpen, setIsOpen] = useState(false);

    const syncDraftFromUrl = useCallback(() => {
        setDraft(
            buildDraftFromUrl(fields, filterDropdownFieldKeys, getUrlValue),
        );
    }, [fields, getUrlValue]);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);

            if (open) {
                syncDraftFromUrl();
            }
        },
        [syncDraftFromUrl],
    );

    const handleDraftChange = useCallback(
        (key: FilterDropdownFieldKey, item: FormFieldItem) => {
            setDraft((prev) => ({
                ...prev,
                [key]: item,
            }));
        },
        [],
    );

    const isAlreadyApplied = isDraftMatchingUrl(
        fields,
        filterDropdownFieldKeys,
        draft,
        getUrlValue,
    );

    const canApply = !isAlreadyApplied;

    const applyFilters = useCallback(() => {
        const filterValues = buildFieldsWithValues(
            fields,
            filterDropdownFieldKeys,
            draft,
        );

        const nextFields: FormFieldProps = {
            ...extraFields,
            ...filterValues,
        };

        const { params, shouldUpdate } = buildUrlParamsFromFormFields({
            fields: nextFields,
            url: currentQuery,
        });

        if (!shouldUpdate) {
            setIsOpen(false);
            return;
        }

        router.replace(params ? `${pathname}?${params}` : pathname, {
            scroll: false,
        });
        setIsOpen(false);
    }, [currentQuery, draft, extraFields, fields, pathname, router]);

    const clearFilters = useCallback(() => {
        const clearedDraft = buildDraftFromUrl(
            fields,
            filterDropdownFieldKeys,
            () => null,
        );

        setDraft(clearedDraft);

        const filterValues = buildFieldsWithValues(
            fields,
            filterDropdownFieldKeys,
            clearedDraft,
        );

        const nextFields: FormFieldProps = {
            ...extraFields,
            ...filterValues,
        };

        const { params, shouldUpdate } = buildUrlParamsFromFormFields({
            fields: nextFields,
            url: currentQuery,
        });

        if (!shouldUpdate) {
            return;
        }

        router.replace(params ? `${pathname}?${params}` : pathname, {
            scroll: false,
        });
    }, [currentQuery, extraFields, fields, pathname, router]);

    const languageField = fields.language;
    const languageDraft = draft.language ?? languageField?.defaultValue;

    return (
        <DropdownMenu
            open={isOpen}
            onOpenChange={handleOpenChange}
        >
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    className={cn('filter-dropdown__trigger', className)}
                    aria-label="Open filters"
                >
                    <SlidersHorizontal
                        className="size-4"
                        aria-hidden
                    />
                    Filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="filter-dropdown__content"
                sideOffset={8}
            >
                <div className="filter-dropdown__panel">
                    <div className="filter-dropdown__columns">
                        {FILTER_COLUMN_KEYS.map((key) => {
                            const field = fields[key];

                            if (!field) {
                                return null;
                            }

                            const draftValue = draft[key] ?? field.defaultValue;

                            return (
                                <div
                                    key={key}
                                    className="filter-dropdown__column"
                                >
                                    <h3 className="filter-dropdown__column-title">
                                        {FILTER_COLUMN_TITLES[key]}
                                    </h3>
                                    <RadioGroup
                                        value={draftValue.id}
                                        onValueChange={(nextId) => {
                                            const item = field.items.find(
                                                (option) =>
                                                    option.id === nextId,
                                            );

                                            if (item) {
                                                handleDraftChange(key, item);
                                            }
                                        }}
                                        className="filter-dropdown__group"
                                    >
                                        {field.items.map((option) => {
                                            const inputId = `${key}-${option.id}`;

                                            return (
                                                <div
                                                    key={option.id}
                                                    className="filter-dropdown__option"
                                                >
                                                    <RadioGroupItem
                                                        value={option.id}
                                                        id={inputId}
                                                    />
                                                    <Label
                                                        htmlFor={inputId}
                                                        className="filter-dropdown__option-label"
                                                    >
                                                        {option.label ??
                                                            option.id}
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </RadioGroup>
                                </div>
                            );
                        })}
                    </div>
                    <div className="filter-dropdown__footer">
                        <span className="filter-dropdown__footer-label">
                            {FILTER_COLUMN_TITLES.language}
                        </span>
                        <button
                            type="button"
                            className="filter-dropdown__language-trigger"
                        >
                            {languageDraft?.label ?? languageDraft?.id}
                            <ChevronDown
                                className="size-4"
                                aria-hidden
                            />
                        </button>
                    </div>
                    <div className="filter-dropdown__actions">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="filter-dropdown__action"
                            onClick={clearFilters}
                        >
                            Clear filter
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="filter-dropdown__action"
                            disabled={!canApply}
                            onClick={applyFilters}
                        >
                            Apply filter
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
