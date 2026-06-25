'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@providers/TRPCProvider';
import { TestUsersList } from './TestUsersList';

export function ClientTestUsers() {
    const trpc = useTRPC();
    const users = useQuery(trpc.users.list.queryOptions());

    return (
        <section>
            <h2 className="mb-2 text-lg font-semibold">Test users (client)</h2>
            {users.isLoading && <p>Loading users…</p>}
            {users.isError && (
                <p className="text-destructive">
                    Could not load users. Is the backend running on port 8080?
                </p>
            )}
            {users.isSuccess && users.data.length === 0 && (
                <p className="text-muted-foreground">No users found.</p>
            )}
            {users.isSuccess && users.data.length > 0 && (
                <TestUsersList users={users.data} />
            )}
        </section>
    );
}
