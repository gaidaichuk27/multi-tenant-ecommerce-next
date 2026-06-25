import { caller } from '@TRPC/server';
import { TestUsersList } from './TestUsersList';

export async function ServerTestUsers() {
    try {
        const users = await caller.users.list();

        return (
            <section className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">
                    Test users (server)
                </h2>
                {users.length === 0 ? (
                    <p className="text-muted-foreground">No users found.</p>
                ) : (
                    <TestUsersList users={users} />
                )}
            </section>
        );
    } catch {
        return (
            <section className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">
                    Test users (server)
                </h2>
                <p className="text-destructive">
                    Could not load users. Is the backend running on port 8080?
                </p>
            </section>
        );
    }
}
