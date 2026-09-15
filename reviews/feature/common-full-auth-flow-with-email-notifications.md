## **Context first**

The header/avatar work I reviewed earlier is merged ([PR #21](https://github.com/gaidaichuk27/multi-tenant-ecommerce-next/pull/21)). What's in the tree now is a much larger, **uncommitted** body of auth work sitting directly on `develop`: email verification, password forgot/restore/change, a Nodemailer layer, rate limiting, and a controllers refactor. That's ~60 modified files plus ~25 new ones with no commit, so I reviewed the working tree.

**Headline:** the security fundamentals here are genuinely good — bcrypt cost 12, reset tokens SHA-256 hashed at rest with timing-safe comparison, `tokenVersion` session invalidation, deliberate timing-attack mitigation on login and forgot-password. Those are things people usually get wrong, and you got them right.

What I found instead are four concrete exploitable gaps and a clear set of duplication that can be collapsed. Two things are worth fixing before this gets committed.

---

## **Security gaps**

### **1. Open redirect after login (high, exploitable)**

The `redirect` query param is pushed straight into the router with no validation:

SignInForm.tsxLines 71-74

const redirect =

searchParams.get('redirect') ??

buildLocalizedPathname('/app', locale);

router.push(redirect);

Send a victim `/{locale}/login?redirect=https://evil-clone.example` and after a genuine successful login they land on the attacker's site — the most convincing possible moment to phish them, because they just authenticated. `//evil.example` works too.

The fix is to accept only same-origin relative paths:

function safeRedirect(target: string | null, fallback: string): string {

if (!target || !target.startsWith('/') || target.startsWith('//')) {

return fallback;

}

return target;

}

### **2. Expired verification links trigger an email send, on the one route with no strict rate limit (high)**

When a verify token is expired, the controller automatically sends a fresh verification email:

verifyEmail.controller.tsLines 106-114

await resendAccountVerificationEmail(user, query.locale);

sendApiSuccess(

res,

200,

AUTH_T_MESSAGES.VERIFY_TOKEN_EXPIRED_RESENT,

'Verification link expired. A new email has been sent.',

{ email: user.email },

);

And this is the only sensitive auth route without `authSensitiveLimiter` — it gets the broad 100/15min cap rather than 20/15min:

authRouter.tsLines 20-20

authRouter.get('/verify-email', controllers.getVerifyEmail);

So anyone holding one old expired link (they never expire as an _identifier_ — the user id is right there in the JWT) can replay it to mail-bomb that user at 5× the intended rate. Email scanners and link prefetchers hitting inbox URLs make this fire accidentally too. Add `authSensitiveLimiter` to the route, and gate the resend behind a per-user cooldown rather than doing it automatically.

### **3. Password reset silently breaks when the email fails to send (high)**

The token hash is committed to the database first, and a send failure is swallowed:

forgotPassword.controller.tsLines 40-54

await db.user.update({

where: { id: user.id },

data: {

resetPasswordToken: hashToken(token),

resetPasswordExpiration: new Date(

Date.now() + PASSWORD_RESET_TTL_MS,

),

},

});

try {

await sendPasswordResetEmail(user, input.locale, token);

} catch (error) {

console.error('Failed to send password reset email:', error);

}

Two problems. The user is told a link was sent when it wasn't, and worse, the write already overwrote any previously issued valid token — so a transient SMTP outage doesn't just fail, it invalidates the working link the user may already have. Account recovery becomes a dead end with a success message.

Your own `register.controller.ts:107-117` handles this correctly by rolling back the user when the email fails. Apply the same shape here: send first, or revert the token fields in the catch. Keep the response body generic either way so you don't reintroduce enumeration.

### **4.** `password-change` **can be brute-forced for the old password (medium)**

authRouter.tsLines 31-35

authRouter.post(

'/password-change',

requireAuth,

controllers.postChangePassword,

);

`requireAuth` is correct and the controller does verify the current password — but with only the broad limiter, an attacker with a stolen session cookie gets 100 guesses per 15 minutes at the old password, which is the credential that gates changing it. Add `authSensitiveLimiter`.

### **Also worth addressing**

**Middleware authenticates on JWT _shape_, not signature.** `peekIsAccessSessionCookie` base64-decodes the payload and checks for `sub` plus an integer `tv`, with no HMAC verification:

middleware.tsLines 183-195

_/\*\* Cookie present ≠ valid session — reject purpose tokens and pre_`tv` _access JWTs. _/\*

function peekIsAccessSessionCookie(token: string): boolean {

const payload = decodeJwtPayload(token);

if (!payload || typeof payload.sub !== 'string') {

return false;

}

A hand-crafted cookie with payload `{"sub":"x","tv":1}` passes. I want to be accurate about the blast radius: this is currently a defense-in-depth gap rather than a live data breach, because mutations go through Express `requireAuth` and `/api/auth/me` does real verification. But only `AppView` actually re-checks server-side (`AppView.tsx:18`); `BackpackView`, `CreateGroupView`, and `PasswordChangeView` rely entirely on middleware. Today those render placeholders, so nothing leaks — the moment one of them renders real user data, this becomes a genuine bypass. Either verify the signature in middleware (jose works on the edge runtime) or make the server-side `caller.auth.me()` check mandatory in every protected view. Given Edge constraints, the second is the more reliable invariant.

**Verification tokens are stateless with no revocation.** Password reset is properly stateful (hashed, stored, expiry-checked, cleared on use). Email verification is a bare JWT — resends create parallel valid links, and nothing can be revoked before the 24h expiry. Worth aligning with the reset design.

**Password restore has a double-consumption race.** `restorePassword.controller.ts` reads the user, compares the hash, then updates. Two concurrent requests can both pass the check. An atomic conditional update (`where: { id, resetPasswordToken: hash }`) closes it.

**Rate limiting won't survive production.** `express-rate-limit` with the default in-memory store means limits reset per process and don't hold behind a load balancer, and there's no `app.set('trust proxy', …)`, so keys won't reflect real client IPs behind a reverse proxy. Needs a shared store before deploy.

**Smaller items:** verify-email responses echo `user.email` back to anyone holding a token (`verifyEmail.controller.ts:60,77,101,113`); `jwt.verify` doesn't pin `algorithms: ['HS256']` (`jwt.ts:74,108`); middleware copies the full URL including reset tokens into an `x-url` header (`middleware.ts:134`) which is unread today but a logging landmine; and `errorHandler.ts:27` logs raw error objects.

### **Repo hygiene — check this before you commit**

`mealstogo-api/` is 83 MB across 6,620 files, untracked but **not** gitignored. A `git add .` on this working tree — which is exactly what 60+ uncommitted files invites — commits a vendored third-party project into history. Its `.env` happens to be saved by that project's own nested `.gitignore`, which is a thin thread to hang secrets on. Either add it to `.gitignore` or move it out of the workspace. Your top-level `.gitignore` is otherwise correct: only `.env*.example` files are tracked.

---

## **Reuse and simplification**

### **The biggest win: let** `requireAuth` **attach the user**

`requireAuth` already fetches the user to check `tokenVersion`, but throws away everything but that one field:

requireAuth.tsLines 38-41

const user = await db.user.findUnique({

where: { id: session.userId },

select: { tokenVersion: true },

});

Then every consumer re-fetches the same row. `requireVerifiedEmail.ts:18-21` queries again for `isEmailConfirmed`, and `me.controller.ts:24-26`, `changePassword.controller.ts`, and `resendVerification.controller.ts` each query again for the full row. A `requireAuth` + `requireVerifiedEmail` + controller chain performs **three identical lookups of the same user per request**.

Select the full row once in `requireAuth` and attach `req.user`. That removes the redundant queries and simultaneously deletes this block, which currently appears verbatim in three controllers:

const userId = req.userId;

if (!userId) {

sendApiError(res, 401, AUTH_T_MESSAGES.ME_UNAUTHORIZED, 'Unauthorized');

return;

}

const user = await db.user.findUnique({ where: { id: userId } });

if (!user) {

sendApiError(res, 401, AUTH_T_MESSAGES.ME_USER_NOT_FOUND, 'User not found');

return;

}

Those guards are unreachable anyway once middleware guarantees the user, so this is a net deletion.

### **Collapse the three route factories into one**

There are currently three overlapping abstractions plus a hand-rolled route, and the split doesn't fall where you'd expect:

| **Module**                     | **Uses** `proxyBackendAuthRoute`**?** | **Sets cookie?** | **Used by**                           |
| ------------------------------ | ------------------------------------- | ---------------- | ------------------------------------- |
| `create-auth-proxy-route.ts`   | yes                                   | no               | forgot, restore, resend, verify-email |
| `create-auth-session-route.ts` | **no** — duplicates `backendFetch`    | yes              | login, register                       |
| `password-change/route.ts`     | yes, then hand-rolls the rest         | yes              | password-change                       |

`createAuthSessionRoute` reimplements the fetch that `proxyBackendAuthRoute` already does, and `password-change/route.ts` hand-writes the exact cookie-set-and-strip-token logic that `createAuthSessionRoute` exists to provide — it only diverges because it needs `forwardAuth: true`. One factory with an optional session mode covers all seven routes:

createAuthRoute({

backendPath,

method, _// 'GET' | 'POST'_

inputSchema,

backendResponseSchema,

forwardAuth, _// covers password-change / resend_

session, _// if set: set httpOnly cookie, return { user } only_

fallbackErrorMessage,

});

`logout` stays standalone since it makes no backend call.

### **Smaller consolidations**

`ensureMinDuration` is byte-identical in `login.controller.ts:25-32` and `forgotPassword.controller.ts:15-22` — it belongs next to `randomDelayNoiseMs` in `backend/lib/token-hash.ts` or a new `auth-timing.ts`. Inside `verifyEmail.controller.ts`, the "already confirmed" and "user not found" responses each appear twice (lines 54-62/95-103 and 44-51/85-92) because the expired-token branch re-derives state the main path already handled; hoisting the user lookup above the try/catch collapses both. And `middleware.ts:197-204` inlines cookie flags instead of importing `getAuthCookieOptions()`, so the two definitions can drift — which matters, because that function is where `secure` and `sameSite` are decided.

---

## **Suggested order**

Fix the redirect validation, add `authSensitiveLimiter` to `/verify-email` and `/password-change`, and make the forgot-password email send transactional — those three are small, localized, and close real holes. Deal with `mealstogo-api/` before the next `git add`. Then decide the middleware-versus-view auth invariant, since that choice shapes every protected page you add next. The refactors are safe to do after, and `requireAuth` attaching `req.user` is the one I'd prioritize because it removes duplication and redundant queries in the same change.

Happy to implement any of these — I'd suggest starting with the three quick security fixes as one commit.
