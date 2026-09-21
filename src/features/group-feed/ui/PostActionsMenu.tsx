'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
    isGroupModeratorRole,
    type GroupMembershipRoleDto,
    type GroupMembershipStatusDto,
} from '@repo/api';
import { useModal } from '@entities/Modal';
import { deletePost, pinPost } from '@lib/posts/client-api';
import { cn } from '@lib/utils';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@shared/ui/Form/Dropdown';

import { EditPostForm } from './EditPostForm';

interface PostActionsMenuProps {
    locale: Language;
    groupSlug: string;
    postId: string;
    authorId: string;
    body: string;
    pinned: boolean;
    viewerUserId: string | null;
    viewerRole: GroupMembershipRoleDto | null;
    viewerStatus: GroupMembershipStatusDto | null;
    /** After delete: refresh on feed, navigate to feed on detail. */
    surface: 'feed' | 'detail';
    /** Immediate body update in the parent while refresh catches up. */
    onSaved?: (body: string) => void;
    className?: string;
}

export function PostActionsMenu({
    locale,
    groupSlug,
    postId,
    authorId,
    body,
    pinned,
    viewerUserId,
    viewerRole,
    viewerStatus,
    surface,
    onSaved,
    className,
}: PostActionsMenuProps) {
    const { t } = useTranslation(['common']);
    const router = useRouter();
    const getSubmitError = useFormApiError();
    const { confirm } = useModal();
    const [isPending, setIsPending] = useState(false);
    const [isPinned, setIsPinned] = useState(pinned);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        setIsPinned(pinned);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on post change only
    }, [postId]);

    const isActiveMember = viewerStatus === 'active';
    const isAuthor =
        isActiveMember && viewerUserId != null && viewerUserId === authorId;
    const isMod = isActiveMember && isGroupModeratorRole(viewerRole);
    const canPin = isMod;
    const canEdit = isAuthor || isMod;
    const canDelete = canEdit;

    if (!canPin && !canEdit && !canDelete) {
        return null;
    }

    const handlePin = async () => {
        if (isPending || !canPin) return;

        const prev = isPinned;
        const next = !isPinned;
        setIsPinned(next);
        setIsPending(true);

        try {
            const result = await pinPost(groupSlug, postId);
            setIsPinned(result.pinned);
            router.refresh();
        } catch (error) {
            setIsPinned(prev);
            toast.error(getSubmitError(error));
        } finally {
            setIsPending(false);
        }
    };

    const handleDeleteRequest = async () => {
        if (isPending || !canDelete) return;

        const confirmed = await confirm({
            title: t('common:group.feed.actions.delete'),
            description: t('common:group.feed.actions.delete_confirm'),
            confirmLabel: t('common:group.feed.actions.delete'),
            cancelLabel: t('common:modal.cancel'),
            destructive: true,
        });
        if (!confirmed) return;

        setIsPending(true);
        try {
            await deletePost(groupSlug, postId);
            if (surface === 'detail') {
                router.push(buildLocalizedPathname(`/${groupSlug}`, locale));
                router.refresh();
            } else {
                router.refresh();
            }
        } catch (error) {
            toast.error(getSubmitError(error));
            setIsPending(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'text-muted-foreground size-8 shrink-0',
                            className,
                        )}
                        aria-label={t('common:group.feed.actions.menu')}
                        disabled={isPending}
                    >
                        <MoreVertical
                            className="size-4"
                            aria-hidden
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {canEdit ? (
                        <DropdownMenuItem
                            disabled={isPending}
                            onSelect={() => {
                                setIsEditOpen(true);
                            }}
                        >
                            {t('common:group.feed.actions.edit')}
                        </DropdownMenuItem>
                    ) : null}
                    {canPin ? (
                        <DropdownMenuItem
                            disabled={isPending}
                            onSelect={() => {
                                void handlePin();
                            }}
                        >
                            {isPinned
                                ? t('common:group.feed.actions.unpin')
                                : t('common:group.feed.actions.pin')}
                        </DropdownMenuItem>
                    ) : null}
                    {canDelete ? (
                        <DropdownMenuItem
                            variant="destructive"
                            disabled={isPending}
                            onSelect={() => {
                                void handleDeleteRequest();
                            }}
                        >
                            {t('common:group.feed.actions.delete')}
                        </DropdownMenuItem>
                    ) : null}
                </DropdownMenuContent>
            </DropdownMenu>

            {isEditOpen ? (
                <EditPostForm
                    onClose={() => setIsEditOpen(false)}
                    onSaved={onSaved}
                    groupSlug={groupSlug}
                    postId={postId}
                    initialBody={body}
                />
            ) : null}
        </>
    );
}
