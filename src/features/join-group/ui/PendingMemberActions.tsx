'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
    MEMBERSHIP_DECLINE_REASON_MAX_LENGTH,
    MEMBERSHIP_T_MESSAGES,
} from '@repo/api';
import {
    approveMembership,
    declineMembership,
} from '@lib/membership/client-api';
import { maxLengthValidation } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { CharacterCount } from '@shared/ui/Form/CharacterCount';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup } from '@shared/ui/Form/Field';
import { Textarea } from '@shared/ui/Form/Textarea';
import type { Language } from '@shared/config/locales/types';

type DeclineFormData = {
    declineReason: string;
};

interface PendingMemberActionsProps {
    groupSlug: string;
    userId: string;
    locale: Language;
    approveLabel: string;
    declineLabel: string;
}

export function PendingMemberActions({
    groupSlug,
    userId,
    locale,
    approveLabel,
    declineLabel,
}: PendingMemberActionsProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [isApproving, setIsApproving] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [showDeclineForm, setShowDeclineForm] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm<DeclineFormData>({
        mode: 'onChange',
        defaultValues: {
            declineReason: '',
        },
    });

    const reasonValue = watch('declineReason');
    const reasonLabel = t('common:group.pending.decline_reason');

    const onApprove = async () => {
        try {
            setIsApproving(true);
            await approveMembership(groupSlug, userId, locale);
            setSubmitError(null);
            toast.success(t(`common:${MEMBERSHIP_T_MESSAGES.APPROVE_SUCCESS}`));
            router.refresh();
        } catch (error) {
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsApproving(false);
        }
    };

    const onDecline = async (data: DeclineFormData) => {
        try {
            setIsDeclining(true);

            const declineReason = data.declineReason.trim() || undefined;
            await declineMembership(groupSlug, userId, locale, declineReason);

            setSubmitError(null);
            clearErrors();
            reset({ declineReason: '' });
            setShowDeclineForm(false);
            toast.success(t(`common:${MEMBERSHIP_T_MESSAGES.DECLINE_SUCCESS}`));
            router.refresh();
        } catch (error) {
            reset(data);
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsDeclining(false);
        }
    };

    const isBusy = isApproving || isDeclining;

    if (showDeclineForm) {
        return (
            <form
                className="flex w-full min-w-[16rem] flex-col gap-2"
                onSubmit={handleSubmit(onDecline)}
            >
                <FieldGroup>
                    <Field data-invalid={Boolean(errors.declineReason)}>
                        <Textarea
                            rows={2}
                            placeholder={t(
                                'common:group.pending.decline_reason_placeholder',
                            )}
                            disabled={isBusy}
                            aria-invalid={Boolean(errors.declineReason)}
                            {...register(
                                'declineReason',
                                maxLengthValidation(
                                    t,
                                    reasonLabel,
                                    MEMBERSHIP_DECLINE_REASON_MAX_LENGTH,
                                ),
                            )}
                        />
                        <CharacterCount
                            value={reasonValue ?? ''}
                            maxLength={MEMBERSHIP_DECLINE_REASON_MAX_LENGTH}
                        />
                        {errors.declineReason?.message ? (
                            <ErrorMessage
                                error={errors.declineReason.message}
                            />
                        ) : null}
                    </Field>
                </FieldGroup>
                {submitError ? <ErrorMessage error={submitError} /> : null}
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                    >
                        {t('common:group.pending.decline_confirm')}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={isBusy}
                        onClick={() => {
                            setShowDeclineForm(false);
                            setSubmitError(null);
                            clearErrors();
                            reset({ declineReason: '' });
                        }}
                    >
                        {t('common:group.pending.decline_cancel')}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
                <Button
                    type="button"
                    size="sm"
                    disabled={isBusy}
                    onClick={onApprove}
                >
                    {approveLabel}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => setShowDeclineForm(true)}
                >
                    {declineLabel}
                </Button>
            </div>
            {submitError ? <ErrorMessage error={submitError} /> : null}
        </div>
    );
}
