import type { TestUserDto } from '../types';

type TestUsersListProps = {
    users: TestUserDto[];
    emptyMessage?: string;
};

export function TestUsersList({
    users,
    emptyMessage = 'No users found.',
}: TestUsersListProps) {
    if (users.length === 0) {
        return <p>{emptyMessage}</p>;
    }

    return (
        <ul className="space-y-2">
            {users.map((user) => (
                <li
                    key={user.id}
                    className="border-border rounded-md border px-3 py-2"
                >
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-sm">
                        {user.email}
                    </p>
                    {user.createdAt && (
                        <p className="text-muted-foreground text-xs">
                            Joined:{' '}
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    )}
                </li>
            ))}
        </ul>
    );
}
