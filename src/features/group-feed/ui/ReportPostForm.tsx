'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { POST_REPORT_REASON_MAX_LENGTH, POST_T_MESSAGES } from '@repo/api';
import { reportPost } from '@lib/posts/client-api';
import { maxLengthValidation } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { CharacterCount } from '@shared/ui/Form/CharacterCount';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup } from '@shared/ui/Form/Field';
import { Textarea } from '@shared/ui/Form/Textarea';
import { Modal } from '@shared/ui/Modal';

type ReportPostFormData = {
    reason: string;
};

interface ReportPostFormProps {
    onClose: () => void;
    groupSlug: string;
    postId: string;
}

/**
 * Mount only while reporting (parent should unmount on close).
 * Modal is always open while this component is mounted.
 * Reason is optional.
 */
export function ReportPostForm({
    onClose,
    groupSlug,
    postId,
}: ReportPostFormProps) {
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
        formState: { errors },
    } = useForm<ReportPostFormData>({
        mode: 'onChange',
        defaultValues: {
            reason: '',
        },
    });

    const reasonValue = watch('reason');
    const reasonLabel = t('common:group.feed.actions.report_reason');

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    const submitFormHandler = async (data: ReportPostFormData) => {
        try {
            setIsSubmitting(true);

            const reason = data.reason.trim() || undefined;
            await reportPost(groupSlug, postId, reason);

            setSubmitError(null);
            clearErrors();
            toast.success(t(`common:${POST_T_MESSAGES.REPORT_SUCCESS}`));
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
            title={t('common:group.feed.actions.report')}
            closeLabel={t('common:modal.close')}
        >
            <form
                onSubmit={handleSubmit(submitFormHandler)}
                noValidate
                className="space-y-3 pb-2"
            >
                <p className="text-muted-foreground text-sm">
                    {t('common:group.feed.actions.report_description')}
                </p>
                <FieldGroup>
                    <Field aria-invalid={Boolean(errors.reason?.message)}>
                        <Textarea
                            id={`report-post-reason-${postId}`}
                            rows={3}
                            maxLength={POST_REPORT_REASON_MAX_LENGTH}
                            aria-invalid={Boolean(errors.reason?.message)}
                            aria-label={reasonLabel}
                            placeholder={t(
                                'common:group.feed.actions.report_reason_placeholder',
                            )}
                            disabled={isSubmitting}
                            data-modal-initial-focus=""
                            {...register(
                                'reason',
                                maxLengthValidation(
                                    t,
                                    reasonLabel,
                                    POST_REPORT_REASON_MAX_LENGTH,
                                ),
                            )}
                        />
                        <div className="mt-1.5 flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                {errors.reason?.message ? (
                                    <ErrorMessage
                                        error={errors.reason.message}
                                    />
                                ) : null}
                            </div>
                            <CharacterCount
                                value={reasonValue}
                                maxLength={POST_REPORT_REASON_MAX_LENGTH}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t('common:loading')
                                : t('common:group.feed.actions.report_submit')}
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </Modal>
    );
}
