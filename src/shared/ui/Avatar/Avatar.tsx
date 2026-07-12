'use client';

import { memo, useMemo, type CSSProperties } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '@entities/User';
import { randomizeAvatar } from '@helpers/randomizeAvatar';
import { avatars } from '@shared/config/avatars';
import { AppImage } from '@shared/ui/AppImage';
import { Typography } from '@shared/ui/Typography';
import { cn } from '@lib/utils';

export type AvatarUser = Pick<
    User,
    'id' | 'name' | 'username' | 'email' | 'avatarUrl'
>;

const AVATAR_SIZES = {
    small: '40px',
    large: '80px',
} as const;

const avatarCssVars = {
    '--avatar-size-small': AVATAR_SIZES.small,
    '--avatar-size-large': AVATAR_SIZES.large,
} as CSSProperties;

interface AvatarProps {
    className?: string;
    size?: 'small' | 'large';
    /** Shows edit affordance; upload/capture handler not implemented yet. */
    editable?: boolean;
    showInfo?: boolean;
    user: AvatarUser;
    onClick?: () => void;
}

export const Avatar = memo(
    ({
        className,
        size = 'small',
        editable = false,
        showInfo = false,
        user,
        onClick,
    }: AvatarProps) => {
        const { t } = useTranslation(['common']);
        const fallbackAvatar = useMemo(
            () => randomizeAvatar(avatars, user.id),
            [user.id],
        );

        const imageSrc = user.avatarUrl ?? fallbackAvatar;
        const displayName = user.name ?? user.username;
        const openMenuLabel = t('common:avatar.open_menu');

        const mediaContent = (
            <>
                <div className="avatar__image-wrapper">
                    <AppImage
                        className="avatar__image"
                        src={imageSrc}
                        fill
                        sizes={AVATAR_SIZES[size]}
                        alt={displayName}
                    />
                </div>
                {editable &&
                    (onClick ? (
                        <span
                            className="avatar__edit"
                            aria-hidden
                        >
                            <Plus className="avatar__edit-icon" />
                        </span>
                    ) : (
                        // TODO: wire avatar edit — camera capture or file upload, then persist avatarUrl.
                        <button
                            type="button"
                            className="avatar__edit"
                            aria-label={t('common:avatar.edit')}
                        >
                            <Plus className="avatar__edit-icon" />
                        </button>
                    ))}
            </>
        );

        return (
            <div
                className={cn(
                    'avatar',
                    `avatar--${size}`,
                    editable && 'avatar--editable',
                    onClick && 'avatar--clickable',
                    className,
                )}
                style={avatarCssVars}
            >
                <div className="avatar__wrapper">
                    {onClick ? (
                        <button
                            type="button"
                            className="avatar__media"
                            onClick={onClick}
                            aria-label={openMenuLabel}
                        >
                            {mediaContent}
                        </button>
                    ) : (
                        <div className="avatar__media">{mediaContent}</div>
                    )}

                    {showInfo && (
                        <div className="avatar__info">
                            <Typography
                                variant="title-4"
                                className="avatar__name"
                            >
                                {displayName}
                            </Typography>
                            <Typography
                                variant="body-3"
                                className="avatar__email"
                            >
                                {user.email}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

Avatar.displayName = 'Avatar';
