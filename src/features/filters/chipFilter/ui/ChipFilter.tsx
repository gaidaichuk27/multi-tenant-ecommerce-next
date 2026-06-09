'use client';

import { memo, useCallback, useState } from 'react';
import {
    usePathname,
    useRouter,
    useSearchParams as useRouterSearchParams,
} from 'next/navigation';

import { cn } from '@lib/utils';
import { buildUrlParamsFromFormFields } from '@helpers/searchParams';
import type {
    AvailableSearchParams,
    FormFieldItem,
    FormFieldProps,
} from '@helpers/searchParams';
import { Button } from '@shared/ui/Form/Button';

interface ChipFilterProps {
    className?: string;
    fieldKey: AvailableSearchParams;
    fields: FormFieldProps;
    extraFields?: FormFieldProps;
    onChange?: (item: FormFieldItem) => void;
    syncSearchParams?: boolean;
}

function ChipFilterComponent({
    className,
    fieldKey,
    fields,
    extraFields,
    onChange,
    syncSearchParams = true,
}: ChipFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const routerSearchParams = useRouterSearchParams();
    const field = fields[fieldKey];

    const [selectedItem, setSelectedItem] = useState<FormFieldItem | undefined>(
        () => field?.defaultValue,
    );

    const selectHandler = useCallback(
        (item: FormFieldItem) => {
            if (!field) {
                return;
            }

            if (!syncSearchParams) {
                setSelectedItem(item);
                onChange?.(item);
                return;
            }

            const nextFields: FormFieldProps = {
                ...extraFields,
                ...fields,
                [fieldKey]: {
                    ...field,
                    value: item,
                },
            };

            const { params, shouldUpdate } = buildUrlParamsFromFormFields({
                fields: nextFields,
                url: routerSearchParams.toString(),
            });

            if (shouldUpdate) {
                router.replace(params ? `${pathname}?${params}` : pathname, {
                    scroll: false,
                });
            }

            onChange?.(item);
        },
        [
            extraFields,
            field,
            fieldKey,
            fields,
            onChange,
            pathname,
            router,
            routerSearchParams,
            syncSearchParams,
        ],
    );

    if (!field) {
        return null;
    }

    const activeId = syncSearchParams
        ? (routerSearchParams.get(fieldKey) ?? field.defaultValue.id)
        : (selectedItem?.id ?? field.defaultValue.id);

    return (
        <div className={cn('chip-filter', className)}>
            <div className="chip-filter__track">
                <div className="chip-filter__list">
                    {field.items.map((item) => {
                        const isActive = activeId === item.id;

                        return (
                            <Button
                                key={item.id}
                                type="button"
                                id={`chip-filter-chip-${item.id}`}
                                variant="outline"
                                className={cn(
                                    'chip-filter__chip',
                                    isActive &&
                                        'bg-primary text-primary-foreground border-primary hover:bg-primary/80 hover:text-primary-foreground',
                                )}
                                aria-pressed={isActive}
                                onClick={() => selectHandler(item)}
                            >
                                {item.label ?? item.id}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export const ChipFilter = memo(ChipFilterComponent);

ChipFilter.displayName = 'ChipFilter';
