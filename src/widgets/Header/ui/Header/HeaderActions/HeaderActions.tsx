'use client';

import { useState } from 'react';
import type { User } from '@entities/User';
import { HeaderAuthButtons } from '@features/auth/buttons';
import { LangSelector } from '@features/langSelector';
import { ThemeSelector, ThemeToggle } from '@features/theme';
import { Avatar } from '@shared/ui/Avatar';
import { SettingsDrawer } from '@widgets/Navigation';

interface HeaderActionsProps {
    user: User | null;
}

export function HeaderActions({ user }: HeaderActionsProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const showAuthButtons = !user;

    return (
        <>
            {showAuthButtons && (
                <HeaderAuthButtons className="hidden lg:flex" />
            )}

            {!user && (
                <>
                    <LangSelector
                        slim
                        className="hidden lg:block"
                    />
                    <ThemeToggle className="hidden lg:block" />
                    <ThemeSelector className="hidden lg:block" />
                </>
            )}

            {user && (
                <Avatar
                    user={user}
                    size="small"
                    onClick={() => setDrawerOpen(true)}
                />
            )}

            <SettingsDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                showAuthButtons={showAuthButtons}
                user={user}
            />
        </>
    );
}
