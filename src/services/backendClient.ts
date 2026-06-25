import { testUsersResponseSchema, type TestUserDto } from '@repo/api';

const BACKEND_FETCH_TIMEOUT_MS = 5_000;

function getBackendUrl(): string {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        throw new Error(
            'BACKEND_URL is not set. Configure it in the root .env file.',
        );
    }

    return backendUrl;
}

export async function fetchTestUsersFromBackend(): Promise<TestUserDto[]> {
    const response = await fetch(`${getBackendUrl()}/api/users`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
    });

    if (response.status === 503) {
        throw new Error('Backend database is unavailable');
    }

    if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
    }

    const json: unknown = await response.json();
    const data = testUsersResponseSchema.parse(json);

    return data.users;
}
