'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@providers/TRPCProvider';

export function ClientGreeting() {
    const trpc = useTRPC();
    const greeting = useQuery(trpc.greeting.sayHello.queryOptions());

    return (
        <p data-testid="client-greeting">
            Greeting (client): {greeting.data?.[0].hello ?? '…'}
        </p>
    );
}
