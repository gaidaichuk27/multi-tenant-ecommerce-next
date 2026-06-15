'use client';

import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';

interface LogOutButtonProps {
    className?: string;
}

export const LogOutButton = ({ className }: LogOutButtonProps) => {
    const clickHandler = async () => {
        try {
            // Delete cookie with explicit parameters

            // Sign out

            // Force full refresh to clear all state
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Optionally show error to user
        }
    };

    return (
        <div className={cn(className)}>
            <Button onClick={clickHandler}>Sign out</Button>
        </div>
    );
};
