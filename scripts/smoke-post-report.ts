/**
 * Focused post.report / listReports / resolveReport smoke via createCaller
 * (avoids full appRouter → mail → SVG).
 *
 * Coverage:
 *   - member can report a peer's post
 *   - member cannot report own post (FORBIDDEN)
 *   - duplicate open report → CONFLICT
 *   - plain member cannot listReports / resolveReport (FORBIDDEN)
 *   - admin can list open reports and resolve/dismiss
 *   - re-report allowed after resolve
 *
 * Usage (from repo root):
 *   pnpm smoke:feed:report
 *
 * Requires at least two active plain members in the same group, plus an
 * admin|owner (moderator-only is not enough — queue matches Pending = admin).
 */
import assert from 'node:assert/strict';
import { TRPCError } from '@trpc/server';
import { db } from '@repo/database';
import type { User } from '@entities/User';
import { createCallerFactory, createTRPCRouter } from '../src/TRPC/init';
import { postRouter } from '../src/TRPC/routers/post';

const createCaller = createCallerFactory(
    createTRPCRouter({ post: postRouter }),
);

const ADMIN_ROLES = ['admin', 'owner'] as const;

function toAppUser(row: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    roles: string[];
    isEmailConfirmed: boolean;
    createdAt: Date;
    updatedAt: Date;
}): User {
    return {
        id: row.id,
        email: row.email,
        username: row.username,
        name: row.name,
        avatarUrl: row.avatarUrl,
        roles: row.roles.map((role) =>
            role === 'super_admin' ? 'super-admin' : 'user',
        ),
        isEmailConfirmed: row.isEmailConfirmed,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

function callerFor(user: Parameters<typeof toAppUser>[0]) {
    return createCaller({
        userId: user.id,
        user: toAppUser(user),
        headers: new Headers(),
    });
}

async function assertCode(
    action: () => Promise<unknown>,
    code: TRPCError['code'],
) {
    await assert.rejects(action, (err: unknown) => {
        assert.ok(err instanceof TRPCError);
        assert.equal(err.code, code);
        return true;
    });
}

async function main() {
    console.log('smoke: post.report / listReports / resolveReport');

    // Prefer a group that has: plain member (reporter) + another active member
    // (post author) + admin|owner (queue). Fall back across groups.
    const candidates = await db.groupMembership.findMany({
        where: { status: 'active', role: 'member' },
        include: {
            group: { select: { id: true, slug: true } },
            user: true,
        },
        orderBy: { joinedAt: 'asc' },
        take: 40,
    });
    assert.ok(candidates.length > 0, 'expected an active plain member');

    let member: (typeof candidates)[number] | null = null;
    let peer: {
        user: (typeof candidates)[number]['user'];
        userId: string;
    } | null = null;
    let admin: {
        user: (typeof candidates)[number]['user'];
        userId: string;
    } | null = null;

    for (const candidate of candidates) {
        const peerMembership = await db.groupMembership.findFirst({
            where: {
                status: 'active',
                groupId: candidate.group.id,
                userId: { not: candidate.userId },
            },
            include: { user: true },
            orderBy: { joinedAt: 'asc' },
        });
        const adminMembership = await db.groupMembership.findFirst({
            where: {
                status: 'active',
                groupId: candidate.group.id,
                role: { in: [...ADMIN_ROLES] },
            },
            include: { user: true },
            orderBy: { joinedAt: 'asc' },
        });

        if (peerMembership && adminMembership) {
            member = candidate;
            peer = peerMembership;
            admin = adminMembership;
            break;
        }
    }

    assert.ok(
        member && peer && admin,
        'expected a group with an active plain member, another active member, and admin|owner',
    );

    const { group } = member;
    const memberCaller = callerFor(member.user);
    const peerCaller = callerFor(peer.user);
    const adminCaller = callerFor(admin.user);

    const postIds: string[] = [];
    const reportIds: string[] = [];

    try {
        const peerPost = await peerCaller.post.create({
            slug: group.slug,
            body: '[smoke] report target post',
        });
        postIds.push(peerPost.id);

        const ownPost = await memberCaller.post.create({
            slug: group.slug,
            body: '[smoke] report own post',
        });
        postIds.push(ownPost.id);

        // --- cannot report own ---
        await assertCode(
            () =>
                memberCaller.post.report({
                    slug: group.slug,
                    postId: ownPost.id,
                }),
            'FORBIDDEN',
        );

        // --- can report peer ---
        const reported = await memberCaller.post.report({
            slug: group.slug,
            postId: peerPost.id,
            reason: '[smoke] spam',
        });
        reportIds.push(reported.id);
        assert.equal(reported.status, 'open');
        assert.equal(reported.postId, peerPost.id);
        assert.equal(reported.reason, '[smoke] spam');

        // --- duplicate open report ---
        await assertCode(
            () =>
                memberCaller.post.report({
                    slug: group.slug,
                    postId: peerPost.id,
                }),
            'CONFLICT',
        );

        // --- plain member cannot list / resolve ---
        await assertCode(
            () =>
                memberCaller.post.listReports({
                    slug: group.slug,
                }),
            'FORBIDDEN',
        );
        await assertCode(
            () =>
                memberCaller.post.resolveReport({
                    slug: group.slug,
                    reportId: reported.id,
                    action: 'resolved',
                }),
            'FORBIDDEN',
        );

        // --- admin list + resolve ---
        const openPage = await adminCaller.post.listReports({
            slug: group.slug,
            status: 'open',
        });
        assert.ok(
            openPage.items.some((item) => item.id === reported.id),
            'open queue should include the new report',
        );

        const resolved = await adminCaller.post.resolveReport({
            slug: group.slug,
            reportId: reported.id,
            action: 'resolved',
            note: '[smoke] handled',
        });
        assert.equal(resolved.status, 'resolved');
        assert.equal(resolved.resolveNote, '[smoke] handled');
        assert.ok(resolved.resolvedAt);

        // --- re-report after resolve ---
        const rereported = await memberCaller.post.report({
            slug: group.slug,
            postId: peerPost.id,
            reason: '[smoke] again',
        });
        reportIds.push(rereported.id);
        assert.equal(rereported.status, 'open');

        const dismissed = await adminCaller.post.resolveReport({
            slug: group.slug,
            reportId: rereported.id,
            action: 'dismissed',
        });
        assert.equal(dismissed.status, 'dismissed');

        // --- resolve already-closed → CONFLICT already_closed (not not_found) ---
        await assert.rejects(
            () =>
                adminCaller.post.resolveReport({
                    slug: group.slug,
                    reportId: rereported.id,
                    action: 'resolved',
                }),
            (err: unknown) => {
                assert.ok(err instanceof TRPCError);
                assert.equal(err.code, 'CONFLICT');
                assert.equal(err.message, 'post.report.already_closed');
                return true;
            },
        );

        console.log(
            `ok: group "${group.slug}" reporter=${member.user.email} peer=${peer.user.email} admin=${admin.user.email}`,
        );
        console.log('\nPASS');
    } finally {
        for (const id of reportIds) {
            await db.postReport.delete({ where: { id } }).catch(() => {});
        }
        for (const id of postIds) {
            await db.post.delete({ where: { id } }).catch(() => {});
        }
        await db.$disconnect();
    }
}

main().catch((err) => {
    console.error('\nFAIL', err);
    process.exitCode = 1;
    void db.$disconnect();
});
