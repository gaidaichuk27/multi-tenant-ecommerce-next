'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { POST_T_MESSAGES, type CategoryDto } from '@repo/api';
import { createPost } from '@lib/posts/client-api';
import { DEFAULT_CHARACTER_LIMIT } from '@shared/config/forms/characterLimit';
import { POST_BODY_VALIDATION } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { CharacterCount } from '@shared/ui/Form/CharacterCount';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup } from '@shared/ui/Form/Field';
import { Textarea } from '@shared/ui/Form/Textarea';
import { cn } from '@lib/utils';

import type { CreatePostFormData } from '../model/types';
import { PostCategoryField } from './PostCategoryField';

interface CreatePostFormProps {
    className?: string;
    groupSlug: string;
    /** Override default storefront character limit (2000). */
    maxLength?: number;
    categories?: CategoryDto[];
    /** Prefill from active feed `?category=` filter (resolved category id). */
    defaultCategoryId?: string | null;
    categoryNoneLabel?: string;
    categoryLabel?: string;
}

function resolveCategoryId(
    defaultCategoryId: string | null | undefined,
    categories: CategoryDto[],
): string {
    return defaultCategoryId &&
        categories.some((category) => category.id === defaultCategoryId)
        ? defaultCategoryId
        : '';
}

export function CreatePostForm({
    className,
    groupSlug,
    maxLength = DEFAULT_CHARACTER_LIMIT,
    categories = [],
    defaultCategoryId = null,
    categoryNoneLabel,
    categoryLabel,
}: CreatePostFormProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const resolvedCategoryNoneLabel =
        categoryNoneLabel ?? t('common:group.feed.composer.category_none');
    const resolvedCategoryLabel =
        categoryLabel ?? t('common:group.feed.composer.category');
    const filterCategoryId = resolveCategoryId(defaultCategoryId, categories);

    const {
        register,
        handleSubmit,
        control,
        reset,
        clearErrors,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<CreatePostFormData>({
        mode: 'onChange',
        defaultValues: {
            body: '',
            categoryId: filterCategoryId,
        },
    });

    // Chip filter changed — update category only; preserve in-progress body draft.
    useEffect(() => {
        setValue('categoryId', filterCategoryId, {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [filterCategoryId, setValue]);

    const bodyValue = watch('body');

    const submitFormHandler = async (data: CreatePostFormData) => {
        try {
            setIsSubmitting(true);

            const categoryId =
                data.categoryId && data.categoryId.length > 0
                    ? data.categoryId
                    : null;

            await createPost(groupSlug, data.body.trim(), categoryId);

            setSubmitError(null);
            clearErrors();
            reset({ body: '', categoryId: filterCategoryId });
            toast.success(t(`common:${POST_T_MESSAGES.CREATE_SUCCESS}`));
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

    return (
        <form
            onSubmit={handleSubmit(submitFormHandler)}
            noValidate
            className={cn('space-y-3 rounded-md border p-4', className)}
        >
            <FieldGroup>
                <Field aria-invalid={Boolean(errors.body?.message)}>
                    <Textarea
                        id="post-body"
                        rows={3}
                        maxLength={maxLength}
                        aria-invalid={Boolean(errors.body?.message)}
                        aria-label={t('common:group.feed.composer.placeholder')}
                        placeholder={t(
                            'common:group.feed.composer.placeholder',
                        )}
                        disabled={isSubmitting}
                        {...register(
                            'body',
                            POST_BODY_VALIDATION(t, maxLength),
                        )}
                    />
                    <div className="mt-1.5 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            {errors.body?.message ? (
                                <ErrorMessage error={errors.body.message} />
                            ) : null}
                        </div>
                        <CharacterCount
                            value={bodyValue}
                            maxLength={maxLength}
                        />
                    </div>
                </Field>

                <PostCategoryField
                    control={control}
                    name="categoryId"
                    categories={categories}
                    categoryLabel={resolvedCategoryLabel}
                    categoryNoneLabel={resolvedCategoryNoneLabel}
                    selectId="post-category"
                    disabled={isSubmitting}
                />

                {submitError ? <ErrorMessage error={submitError} /> : null}

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:group.feed.composer.submit')}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
