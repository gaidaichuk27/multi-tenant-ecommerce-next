'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { MEMBERSHIP_T_MESSAGES } from '@repo/api';
import {
    approveMembership,
    declineMembership,
} from '@lib/membership/client-api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';

interface PendingMemberActionsProps {
    groupSlug: string;
    userId: string;
    approveLabel: string;
    declineLabel: string;
}

export function PendingMemberActions({
    groupSlug,
    userId,
    approveLabel,
    declineLabel,
}: PendingMemberActionsProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const run = async (action: 'approve' | 'decline') => {
        try {
            setIsSubmitting(true);

            if (action === 'approve') {
                await approveMembership(groupSlug, userId);
                toast.success(
                    t(`common:${MEMBERSHIP_T_MESSAGES.APPROVE_SUCCESS}`),
                );
            } else {
                await declineMembership(groupSlug, userId);
                toast.success(
                    t(`common:${MEMBERSHIP_T_MESSAGES.DECLINE_SUCCESS}`),
                );
            }

            router.refresh();
        } catch (error) {
            toast.error(getSubmitError(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={() => run('approve')}
            >
                {approveLabel}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => run('decline')}
            >
                {declineLabel}
            </Button>
        </div>
    );
}
