'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { POST_REPORT_NOTE_MAX_LENGTH, POST_T_MESSAGES } from '@repo/api';
import { useModal } from '@entities/Modal';
import { resolvePostReport } from '@lib/posts/client-api';
import { maxLengthValidation } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { CharacterCount } from '@shared/ui/Form/CharacterCount';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup } from '@shared/ui/Form/Field';
import { Textarea } from '@shared/ui/Form/Textarea';

type NoteFormData = {
    note: string;
};

interface ReportQueueActionsProps {
    groupSlug: string;
    reportId: string;
    resolveLabel: string;
    dismissLabel: string;
}

export function ReportQueueActions({
    groupSlug,
    reportId,
    resolveLabel,
    dismissLabel,
}: ReportQueueActionsProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const { confirm } = useModal();
    const [isResolving, setIsResolving] = useState(false);
    const [isDismissing, setIsDismissing] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        reset,
        clearErrors,
        watch,
        getValues,
        formState: { errors },
    } = useForm<NoteFormData>({
        mode: 'onChange',
        defaultValues: { note: '' },
    });

    const noteValue = watch('note');
    const noteLabel = t('common:group.reports.note');
    const isBusy = isResolving || isDismissing;

    const takeNote = () => {
        const trimmed = getValues('note').trim();
        return trimmed || undefined;
    };

    const onResolve = async () => {
        try {
            setIsResolving(true);
            await resolvePostReport(
                groupSlug,
                reportId,
                'resolved',
                takeNote(),
            );
            setSubmitError(null);
            clearErrors();
            reset({ note: '' });
            toast.success(
                t(`common:${POST_T_MESSAGES.REPORT_RESOLVE_SUCCESS}`),
            );
            router.refresh();
        } catch (error) {
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsResolving(false);
        }
    };

    const onDismiss = async () => {
        const confirmed = await confirm({
            title: t('common:group.reports.dismiss'),
            description: t('common:group.reports.dismiss_confirm'),
            confirmLabel: t('common:group.reports.dismiss'),
            cancelLabel: t('common:modal.cancel'),
        });
        if (!confirmed) return;

        try {
            setIsDismissing(true);
            await resolvePostReport(
                groupSlug,
                reportId,
                'dismissed',
                takeNote(),
            );
            setSubmitError(null);
            clearErrors();
            reset({ note: '' });
            toast.success(
                t(`common:${POST_T_MESSAGES.REPORT_DISMISS_SUCCESS}`),
            );
            router.refresh();
        } catch (error) {
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsDismissing(false);
        }
    };

    return (
        <div className="flex w-full min-w-[14rem] flex-col items-stretch gap-2 sm:max-w-xs sm:items-end">
            <FieldGroup className="w-full">
                <Field data-invalid={Boolean(errors.note)}>
                    <Textarea
                        rows={2}
                        placeholder={t('common:group.reports.note_placeholder')}
                        disabled={isBusy}
                        aria-invalid={Boolean(errors.note)}
                        aria-label={noteLabel}
                        {...register(
                            'note',
                            maxLengthValidation(
                                t,
                                noteLabel,
                                POST_REPORT_NOTE_MAX_LENGTH,
                            ),
                        )}
                    />
                    <CharacterCount
                        value={noteValue ?? ''}
                        maxLength={POST_REPORT_NOTE_MAX_LENGTH}
                    />
                    {errors.note?.message ? (
                        <ErrorMessage error={errors.note.message} />
                    ) : null}
                </Field>
            </FieldGroup>
            <div className="flex gap-2 self-end">
                <Button
                    type="button"
                    size="sm"
                    disabled={isBusy || Boolean(errors.note)}
                    onClick={() => {
                        void onResolve();
                    }}
                >
                    {resolveLabel}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isBusy || Boolean(errors.note)}
                    onClick={() => {
                        void onDismiss();
                    }}
                >
                    {dismissLabel}
                </Button>
            </div>
            {submitError ? <ErrorMessage error={submitError} /> : null}
        </div>
    );
}
