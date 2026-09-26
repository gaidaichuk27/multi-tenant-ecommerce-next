'use client';

import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';
import type { CategoryDto } from '@repo/api';
import { Field, FieldLabel } from '@shared/ui/Form/Field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/Form/Select';

/** Radix Select disallows empty string values — map to/from form `categoryId`. */
export const CATEGORY_NONE_VALUE = '__none__';

type PostCategoryFieldProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    categories: CategoryDto[];
    categoryLabel: string;
    categoryNoneLabel: string;
    selectId: string;
    disabled?: boolean;
};

export function PostCategoryField<TFieldValues extends FieldValues>({
    control,
    name,
    categories,
    categoryLabel,
    categoryNoneLabel,
    selectId,
    disabled = false,
}: PostCategoryFieldProps<TFieldValues>) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <Field>
            <FieldLabel htmlFor={selectId}>{categoryLabel}</FieldLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const current =
                        typeof field.value === 'string' ? field.value : '';

                    return (
                        <Select
                            value={
                                current.length > 0
                                    ? current
                                    : CATEGORY_NONE_VALUE
                            }
                            onValueChange={(value) =>
                                field.onChange(
                                    value === CATEGORY_NONE_VALUE ? '' : value,
                                )
                            }
                            disabled={disabled}
                        >
                            <SelectTrigger
                                id={selectId}
                                className="w-full"
                            >
                                <SelectValue placeholder={categoryNoneLabel} />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value={CATEGORY_NONE_VALUE}>
                                    {categoryNoneLabel}
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                }}
            />
        </Field>
    );
}
