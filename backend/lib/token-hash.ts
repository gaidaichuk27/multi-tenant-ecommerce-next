import { createHash, randomBytes } from 'crypto';

export function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

export function randomDelayNoiseMs(maxMs = 50): number {
    return randomBytes(1)[0]! % (maxMs + 1);
}

/** Pad auth responses so timing is harder to use as an oracle. */
export async function ensureMinDuration(
    startedAt: number,
    minMs: number,
): Promise<void> {
    const elapsed = Date.now() - startedAt;
    const waitFor = minMs + randomDelayNoiseMs() - elapsed;

    if (waitFor > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitFor));
    }
}
