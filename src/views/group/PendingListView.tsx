import type { Membership } from '@entities/Membership';
import { Avatar } from '@shared/ui/Avatar';
import { PendingMemberActions } from '@features/join-group';

interface PendingListViewProps {
    groupSlug: string;
    title: string;
    emptyLabel: string;
    approveLabel: string;
    declineLabel: string;
    members: Membership[];
}

export function PendingListView({
    groupSlug,
    title,
    emptyLabel,
    approveLabel,
    declineLabel,
    members,
}: PendingListViewProps) {
    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold">{title}</h2>
            {members.length === 0 ? (
                <p className="text-muted-foreground text-sm">{emptyLabel}</p>
            ) : (
                <ul className="divide-border divide-y rounded-md border">
                    {members.map((member) => (
                        <li
                            key={member.id}
                            className="flex items-center gap-3 px-4 py-3"
                        >
                            <Avatar
                                user={{
                                    id: member.user?.id ?? member.userId,
                                    name: member.user?.name ?? null,
                                    username:
                                        member.user?.username ?? member.userId,
                                    email: '',
                                    avatarUrl: member.user?.avatarUrl ?? null,
                                }}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">
                                    {member.user?.name ??
                                        member.user?.username ??
                                        member.userId}
                                </p>
                                <p className="text-muted-foreground truncate text-sm">
                                    @{member.user?.username ?? member.userId}
                                </p>
                            </div>
                            <PendingMemberActions
                                groupSlug={groupSlug}
                                userId={member.userId}
                                approveLabel={approveLabel}
                                declineLabel={declineLabel}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
