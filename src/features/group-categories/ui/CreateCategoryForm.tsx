'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
    CATEGORY_MAX_PER_GROUP,
    CATEGORY_NAME_MAX_LENGTH,
    CATEGORY_T_MESSAGES,
} from '@repo/api';
import { TriangleAlert } from 'lucide-react';
import { createCategory } from '@lib/categories/client-api';
import { maxLengthValidation } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Alert, AlertTitle } from '@shared/ui/Alert';
import { Button } from '@shared/ui/Form/Button';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { Input } from '@shared/ui/Form/Input';
import { cn } from '@lib/utils';

type CreateCategoryFormData = {
    name: string;
};

interface CreateCategoryFormProps {
    className?: string;
    groupSlug: string;
    categoryCount: number;
}

export function CreateCategoryForm({
    className,
    groupSlug,
    categoryCount,
}: CreateCategoryFormProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const atCap = categoryCount >= CATEGORY_MAX_PER_GROUP;

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isValid },
    } = useForm<CreateCategoryFormData>({
        mode: 'onChange',
        defaultValues: { name: '' },
    });

    const submitFormHandler = async (data: CreateCategoryFormData) => {
        try {
            setIsSubmitting(true);

            await createCategory(groupSlug, data.name.trim());

            setSubmitError(null);
            clearErrors();
            reset({ name: '' });
            toast.success(t(`common:${CATEGORY_T_MESSAGES.CREATE_SUCCESS}`));
            router.refresh();
        } catch (error) {
            reset(data);
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (atCap) {
        return (
            <Alert
                variant="warning"
                role="status"
                className={className}
            >
                <TriangleAlert />
                <AlertTitle>
                    {t('common:group.categories.max_hint', {
                        max: CATEGORY_MAX_PER_GROUP,
                    })}
                </AlertTitle>
            </Alert>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(submitFormHandler)}
            noValidate
            className={cn('space-y-3', className)}
        >
            <FieldGroup>
                <Field
                    aria-invalid={Boolean(errors.name?.message || submitError)}
                    className="mb-0"
                >
                    <FieldLabel htmlFor="category-name">
                        {t('common:group.categories.name')}
                    </FieldLabel>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <Input
                                id="category-name"
                                maxLength={CATEGORY_NAME_MAX_LENGTH}
                                aria-invalid={Boolean(
                                    errors.name?.message || submitError,
                                )}
                                placeholder={t(
                                    'common:group.categories.name_placeholder',
                                )}
                                disabled={isSubmitting}
                                {...register('name', {
                                    required: t(
                                        `common:${CATEGORY_T_MESSAGES.NAME_REQUIRED}`,
                                    ),
                                    validate: (value) =>
                                        value.trim().length > 0 ||
                                        t(
                                            `common:${CATEGORY_T_MESSAGES.NAME_REQUIRED}`,
                                        ),
                                    ...maxLengthValidation(
                                        t,
                                        t('common:group.categories.name'),
                                        CATEGORY_NAME_MAX_LENGTH,
                                    ),
                                })}
                            />
                            {errors.name?.message ? (
                                <ErrorMessage error={errors.name.message} />
                            ) : submitError ? (
                                <ErrorMessage error={submitError} />
                            ) : null}
                        </div>
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting
                                ? t('common:loading')
                                : t('common:group.categories.create')}
                        </Button>
                    </div>
                </Field>
            </FieldGroup>
        </form>
    );
}
