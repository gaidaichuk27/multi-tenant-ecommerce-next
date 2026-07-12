import { headers } from 'next/headers';
import { getAuthSession } from '@lib/auth/session';
import { Logo } from '@shared/ui/Logo';
import { HeaderActions } from './HeaderActions';
import { HeaderClient } from './HeaderClient';

interface HeaderProps {
    className?: string;
    isSticky?: boolean;
}

export async function Header({ isSticky = true }: HeaderProps) {
    const session = await getAuthSession(await headers());

    return (
        <HeaderClient isSticky={isSticky}>
            <div className="header__inner">
                <div className="header__top">
                    <Logo />

                    <div className="ml-auto flex items-center gap-1.5">
                        <HeaderActions user={session?.user ?? null} />
                    </div>
                </div>
            </div>
            <div className="header__backdrop"></div>
        </HeaderClient>
    );
}
