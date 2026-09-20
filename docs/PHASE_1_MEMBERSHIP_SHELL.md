# Phase 1 — Membership & group shell

Split of community Phase 1 (join / membership / group chrome) into four stacked PRs so each review stays small.

## Branch strategy

| Phase | Branch                                          | Scope                                                                                                      |
| ----- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1     | `feature/common-group-membership-shell-phase-1` | Corrective migration, `@repo/api` membership contracts, `group*Procedure` stack, `group.getMineMembership` |
| 2     | `feature/common-group-membership-shell-phase-2` | `membership` router APIs + `group.getPublic`                                                               |
| 3     | `feature/common-group-membership-shell-phase-3` | Group layout, nav, feed placeholder                                                                        |
| 4     | `feature/common-group-membership-shell-phase-4` | Join/leave UI, members + pending pages                                                                     |

Merge each PR into `develop` before starting the next (or rebase the next onto the previous).

**Out of scope across all four:** membership questions, categories, posts/comments, Redis rate limits, Google OAuth.

---

## Phase 1 checklist

- [x] Corrective Prisma migration: `users.is_email_confirmed`, `users.token_version`
- [x] `@repo/api` membership schemas + `MEMBERSHIP_T_MESSAGES` + serializers
- [x] `groupProcedure` / `groupMemberProcedure` / `groupModeratorProcedure` / `groupAdminProcedure` / `groupOwnerProcedure`
- [x] `group.getMineMembership` smoke procedure
- [x] Cursor rule: group procedures resolve from slug

**Exit:** Migration applies; procedures compile; no new pages.

## Phase 2 checklist

- [x] `membership` router: `requestJoin`, `leave`, `listMembers`, `listPending`, `approve`, `decline`, `updateRole`, `ban`
- [x] `group.getPublic` → `{ group, memberCount, viewerMembership }`
- [x] Server query helpers under `src/lib/groups` / `src/lib/membership`

**Exit:** Second verified user can join a public group via API; private → pending; admin approve/decline works.

## Phase 3 checklist

- [x] `app/[locale]/[group]/layout.tsx` + feed placeholder page
- [x] `GroupNav` widget; about stays public
- [x] Member routes use `requireAuthSession`

**Exit:** Active member sees shell at `/{group}`; guests redirect to about.

## Phase 4 checklist

- [x] `src/features/join-group/` + about CTAs
- [x] `/{group}/-/members` and `/{group}/-/pending`
- [x] About uses `group.getPublic`

**Exit:** End-to-end join from about → feed; pending queue for private groups.

---

## Follow-ups (not in this stacked PR)

Membership **email notifications** (reuse auth mailer patterns; best-effort send):

- [x] **Owner/admins** — email when someone `requestJoin`s (especially private → pending), with link to `/{group}/-/pending`
- [x] **Joiner** — email when request is **approved** (link to `/{group}`)
- [x] **Joiner** — email when request is **declined**
- [x] **Decline reason (optional)** — short note from admin on decline; pass through and include in the joiner email so they can correct behavior and re-request
- [x] Wire into `membership.requestJoin` / `approve` / `decline`; templates live in `@repo/mailer` (auth wrappers remain in `backend/lib/mailer/auth-emails.ts`); respect future notification prefs when those exist

Also deferred from the original out-of-scope list: membership questions, categories, posts/comments.
