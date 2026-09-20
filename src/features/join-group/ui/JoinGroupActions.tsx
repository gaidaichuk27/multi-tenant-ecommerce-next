'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { MEMBERSHIP_T_MESSAGES, type MembershipDto } from '@repo/api';
import type { Group } from '@entities/Group';
import { leaveGroup, requestJoinGroup } from '@lib/membership/client-api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';

type JoinGroupLabels = {
    join: string;
    requestJoin: string;
    pending: string;
    openCommunity: string;
    leave: string;
    loginToJoin: string;
    banned: string;
};

interface JoinGroupActionsProps {
    className?: string;
    locale: Language;
    group: Group;
    viewerMembership: MembershipDto | null;
    isAuthenticated: boolean;
    labels: JoinGroupLabels;
}

export function JoinGroupActions({
    className,
    locale,
    group,
    viewerMembership,
    isAuthenticated,
    labels,
}: JoinGroupActionsProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const aboutPath = buildLocalizedPathname(`/${group.slug}/about`, locale);
    const feedPath = buildLocalizedPathname(`/${group.slug}`, locale);
    const loginPath = `${buildLocalizedPathname('/login', locale)}?redirect=${encodeURIComponent(aboutPath)}`;

    const handleJoin = async () => {
        try {
            setIsSubmitting(true);
            const membership = await requestJoinGroup(group.slug, locale);

            if (membership.status === 'pending') {
                toast.success(
                    t(`common:${MEMBERSHIP_T_MESSAGES.JOIN_PENDING}`),
                );
            } else {
                toast.success(
                    t(`common:${MEMBERSHIP_T_MESSAGES.JOIN_SUCCESS}`),
                );
                router.push(feedPath);
            }

            router.refresh();
        } catch (error) {
            toast.error(getSubmitError(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLeave = async () => {
        try {
            setIsSubmitting(true);
            await leaveGroup(group.slug);
            toast.success(t(`common:${MEMBERSHIP_T_MESSAGES.LEAVE_SUCCESS}`));
            router.refresh();
        } catch (error) {
            toast.error(getSubmitError(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Button
                asChild
                className={className}
            >
                <Link href={loginPath}>{labels.loginToJoin}</Link>
            </Button>
        );
    }

    if (viewerMembership?.status === 'banned') {
        return (
            <p className={cn('text-muted-foreground text-sm', className)}>
                {labels.banned}
            </p>
        );
    }

    if (viewerMembership?.status === 'pending') {
        return (
            <Button
                disabled
                variant="secondary"
                className={className}
            >
                {labels.pending}
            </Button>
        );
    }

    if (viewerMembership?.status === 'active') {
        return (
            <div className={cn('flex flex-wrap gap-3', className)}>
                <Button asChild>
                    <Link href={feedPath}>{labels.openCommunity}</Link>
                </Button>
                {viewerMembership.role !== 'owner' ? (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={handleLeave}
                    >
                        {labels.leave}
                    </Button>
                ) : null}
            </div>
        );
    }

    const joinLabel =
        group.visibility === 'private' ? labels.requestJoin : labels.join;

    return (
        <Button
            type="button"
            disabled={isSubmitting}
            className={className}
            onClick={handleJoin}
        >
            {isSubmitting ? t('common:loading') : joinLabel}
        </Button>
    );
}
