'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { COMMENT_T_MESSAGES } from '@repo/api';
import { createComment } from '@lib/comments/client-api';
import { DEFAULT_CHARACTER_LIMIT } from '@shared/config/forms/characterLimit';
import { COMMENT_BODY_VALIDATION } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { CharacterCount } from '@shared/ui/Form/CharacterCount';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup } from '@shared/ui/Form/Field';
import { Textarea } from '@shared/ui/Form/Textarea';
import { cn } from '@lib/utils';

import type { CreateCommentFormData } from '../model/comment-types';

interface CreateCommentFormProps {
    className?: string;
    groupSlug: string;
    postId: string;
    parentId?: string;
    /** Override default storefront character limit (2000). */
    maxLength?: number;
    onSuccess?: () => void;
}

export function CreateCommentForm({
    className,
    groupSlug,
    postId,
    parentId,
    maxLength = DEFAULT_CHARACTER_LIMIT,
    onSuccess,
}: CreateCommentFormProps) {
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
        formState: { errors, isValid },
    } = useForm<CreateCommentFormData>({
        mode: 'onChange',
        defaultValues: {
            body: '',
        },
    });

    const bodyValue = watch('body');

    const submitFormHandler = async (data: CreateCommentFormData) => {
        try {
            setIsSubmitting(true);

            await createComment({
                slug: groupSlug,
                postId,
                body: data.body.trim(),
                parentId,
            });

            setSubmitError(null);
            clearErrors();
            reset({ body: '' });
            toast.success(t(`common:${COMMENT_T_MESSAGES.CREATE_SUCCESS}`));
            onSuccess?.();
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
                        id={
                            parentId
                                ? `comment-body-${parentId}`
                                : 'comment-body'
                        }
                        rows={3}
                        maxLength={maxLength}
                        aria-invalid={Boolean(errors.body?.message)}
                        aria-label={t('common:group.post.comment.placeholder')}
                        placeholder={t('common:group.post.comment.placeholder')}
                        disabled={isSubmitting}
                        {...register(
                            'body',
                            COMMENT_BODY_VALIDATION(t, maxLength),
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

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:group.post.comment.submit')}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
