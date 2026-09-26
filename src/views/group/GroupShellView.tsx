import type { ReactNode } from 'react';
import { isGroupAdminRole } from '@repo/api';
import type { Group } from '@entities/Group';
import type { Membership } from '@entities/Membership';
import { WithMainLayout } from '@hocs/WithMainLayout';
import type { Language } from '@shared/config/locales/types';
import { SectionHeader } from '@shared/ui/Typography';
import { GroupNav, type GroupNavLabels } from '@widgets/GroupNav';

interface GroupShellViewProps {
    locale: Language;
    group: Group;
    membership: Membership;
    navLabels: GroupNavLabels;
    children: ReactNode;
}

export function GroupShellView({
    locale,
    group,
    membership,
    navLabels,
    children,
}: GroupShellViewProps) {
    const Layouted = WithMainLayout(() => (
        <div className="mx-auto w-full max-w-4xl p-6">
            <SectionHeader
                title={group.name}
                subTitle={group.description ?? undefined}
                className="mb-4"
            />
            <GroupNav
                locale={locale}
                groupSlug={group.slug}
                showPending={isGroupAdminRole(membership.role)}
                showReports={isGroupAdminRole(membership.role)}
                showCategories={isGroupAdminRole(membership.role)}
                labels={navLabels}
            />
            {children}
        </div>
    ));

    return <Layouted />;
}
