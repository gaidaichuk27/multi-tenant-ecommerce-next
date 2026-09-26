'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { POST_T_MESSAGES, type CategoryDto } from '@repo/api';
import { updatePost } from '@lib/posts/client-api';
import { DEFAULT_CHARACTER_LIMIT } from '@shared/config/forms/characterLimit';
import { POST_BODY_VALIDATION } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { CharacterCount } from '@shared/ui/Form/CharacterCount';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup } from '@shared/ui/Form/Field';
import { Textarea } from '@shared/ui/Form/Textarea';
import { Modal } from '@shared/ui/Modal';

import type { EditPostFormData } from '../model/types';
import { PostCategoryField } from './PostCategoryField';

export type SavedPostFields = {
    body: string;
    categoryId: string | null;
};

interface EditPostFormProps {
    onClose: () => void;
    /** Immediate UI update before `router.refresh()` lands. */
    onSaved?: (saved: SavedPostFields) => void;
    groupSlug: string;
    postId: string;
    initialBody: string;
    initialCategoryId?: string | null;
    categories?: CategoryDto[];
    categoryNoneLabel?: string;
    categoryLabel?: string;
    /** Override default storefront character limit (2000). */
    maxLength?: number;
}

/**
 * Mount only while editing (parent should unmount on close).
 * Modal is always open while this component is mounted.
 */
export function EditPostForm({
    onClose,
    onSaved,
    groupSlug,
    postId,
    initialBody,
    initialCategoryId = null,
    categories = [],
    categoryNoneLabel,
    categoryLabel,
    maxLength = DEFAULT_CHARACTER_LIMIT,
}: EditPostFormProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const showCategorySelect = categories.length > 0;
    const resolvedCategoryNoneLabel =
        categoryNoneLabel ?? t('common:group.feed.composer.category_none');
    const resolvedCategoryLabel =
        categoryLabel ?? t('common:group.feed.composer.category');

    const {
        register,
        handleSubmit,
        control,
        reset,
        clearErrors,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm<EditPostFormData>({
        mode: 'onChange',
        defaultValues: {
            body: initialBody,
            categoryId: initialCategoryId ?? '',
        },
    });

    const bodyValue = watch('body');

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    const submitFormHandler = async (data: EditPostFormData) => {
        try {
            setIsSubmitting(true);

            const nextBody = data.body.trim();
            const categoryId =
                data.categoryId && data.categoryId.length > 0
                    ? data.categoryId
                    : null;

            await updatePost(
                groupSlug,
                postId,
                nextBody,
                showCategorySelect ? categoryId : undefined,
            );

            setSubmitError(null);
            clearErrors();
            toast.success(t(`common:${POST_T_MESSAGES.UPDATE_SUCCESS}`));
            onSaved?.({
                body: nextBody,
                categoryId: showCategorySelect
                    ? categoryId
                    : (initialCategoryId ?? null),
            });
            onClose();
            router.refresh();
        } catch (error) {
            reset(data);
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen
            onClose={handleClose}
            dismissible={!isSubmitting}
            width="medium"
            title={t('common:group.feed.actions.edit')}
            closeLabel={t('common:modal.close')}
        >
            <form
                onSubmit={handleSubmit(submitFormHandler)}
                noValidate
                className="space-y-3 pb-2"
            >
                <FieldGroup>
                    <Field aria-invalid={Boolean(errors.body?.message)}>
                        <Textarea
                            id={`edit-post-body-${postId}`}
                            rows={5}
                            maxLength={maxLength}
                            aria-invalid={Boolean(errors.body?.message)}
                            aria-label={t(
                                'common:group.feed.composer.placeholder',
                            )}
                            placeholder={t(
                                'common:group.feed.composer.placeholder',
                            )}
                            disabled={isSubmitting}
                            data-modal-initial-focus=""
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
                        selectId={`edit-post-category-${postId}`}
                        disabled={isSubmitting}
                    />

                    {submitError ? <ErrorMessage error={submitError} /> : null}

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={handleClose}
                        >
                            {t('common:modal.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid || !isDirty || isSubmitting}
                        >
                            {isSubmitting
                                ? t('common:loading')
                                : t('common:group.feed.actions.save')}
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </Modal>
    );
}
