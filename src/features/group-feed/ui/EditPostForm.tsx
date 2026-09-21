'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { POST_T_MESSAGES } from '@repo/api';
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

import type { PostBodyFormData } from '../model/types';

interface EditPostFormProps {
    onClose: () => void;
    /** Immediate UI update before `router.refresh()` lands. */
    onSaved?: (body: string) => void;
    groupSlug: string;
    postId: string;
    initialBody: string;
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
    maxLength = DEFAULT_CHARACTER_LIMIT,
}: EditPostFormProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm<PostBodyFormData>({
        mode: 'onChange',
        defaultValues: {
            body: initialBody,
        },
    });

    const bodyValue = watch('body');

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    const submitFormHandler = async (data: PostBodyFormData) => {
        try {
            setIsSubmitting(true);

            const nextBody = data.body.trim();
            await updatePost(groupSlug, postId, nextBody);

            setSubmitError(null);
            clearErrors();
            toast.success(t(`common:${POST_T_MESSAGES.UPDATE_SUCCESS}`));
            onSaved?.(nextBody);
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
