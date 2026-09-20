'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { togglePostLike } from '@lib/posts/client-api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';

interface LikePostButtonProps {
    groupSlug: string;
    postId: string;
    likeCount?: number;
    likedByViewer?: boolean;
    className?: string;
}

export function LikePostButton({
    groupSlug,
    postId,
    likeCount = 0,
    likedByViewer = false,
    className,
}: LikePostButtonProps) {
    const { t } = useTranslation(['common']);
    const router = useRouter();
    const getSubmitError = useFormApiError();
    const [liked, setLiked] = useState(likedByViewer);
    const [count, setCount] = useState(likeCount);
    const [isPending, setIsPending] = useState(false);

    // Only re-seed from SSR when the post identity changes. Avoids flicker when
    // router.refresh() lands with briefly-stale props after a successful toggle.
    useEffect(() => {
        setLiked(likedByViewer);
        setCount(likeCount);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on post change only
    }, [postId]);

    const label = liked
        ? t('common:group.feed.unlike')
        : t('common:group.feed.like');

    const handleClick = async () => {
        if (isPending) return;

        const prevLiked = liked;
        const prevCount = count;
        const nextLiked = !liked;
        const nextCount = Math.max(0, count + (nextLiked ? 1 : -1));

        setLiked(nextLiked);
        setCount(nextCount);
        setIsPending(true);

        try {
            const result = await togglePostLike(groupSlug, postId);
            setLiked(result.liked);
            setCount(result.likeCount);
            router.refresh();
        } catch (error) {
            setLiked(prevLiked);
            setCount(prevCount);
            toast.error(getSubmitError(error));
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
                'text-muted-foreground h-auto gap-1.5 px-0 text-xs',
                liked && 'text-foreground',
                className,
            )}
            aria-pressed={liked}
            aria-label={label}
            disabled={isPending}
            onClick={handleClick}
        >
            <Heart
                className={cn('size-3.5', liked && 'fill-current')}
                aria-hidden
            />
            <span>{t('common:group.feed.likes_count', { count })}</span>
        </Button>
    );
}
