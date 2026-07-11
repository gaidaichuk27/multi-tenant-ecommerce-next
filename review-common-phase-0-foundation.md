# **PR Review:** `feature/common-phase-0-foundation` **→** `develop`

**Scope:** 1 commit, 87 files, ~+4,291 / −594 lines  
**Theme:** Phase 0 foundation — auth bridge, groups schema, platform shell, API contracts, middleware

---

## **Executive summary**

This is a **solid architectural foundation** with clear layering and documented conventions. The main risks are **incomplete password flows**, **client/server validation drift**, **locale pattern inconsistency**, and **copy-paste duplication** that will compound as Phase 1 grows.

**Recommendation:** Approve with changes requested — merge after fixing blockers; address duplication and locale consistency before the next feature PR.

---

## **What works well**

### **1. Layered API contract design**

The `@repo/api` package is the right single source of truth:

Client forms → client-api.ts → Next /api/\* → backendFetch → Express → @repo/api schemas

- Zod inputs, response schemas, `tMessage` keys, and serializers live together
- Express uses thin `sendApiSuccess` / `sendApiError` wrappers
- Next routes proxy auth and strip tokens from JSON (cookie-only) — good security choice
- Cursor rules (`.cursor/rules/*.mdc`) encode this well for future contributors

### **2. Auth flow is coherent**

- JWT in httpOnly cookie (`getAuthCookieOptions`)
- Middleware forwards token as `Authorization` + sets `x-group-slug`
- Guest-only vs protected route split matches the SKOOL plan
- `getAuthSession` → backend `/me` is a clean server-side session resolution path

### **3. Groups domain model**

Prisma schema is well-structured for Phase 0:

- `Group`, `GroupSettings`, `GroupMembership` with proper enums and cascades
- tRPC `group.create` uses a transaction (group + settings + owner membership) — correct
- `serializeGroup` / `serializeUser` keep DB shapes out of the client

### **4. Form pattern consistency**

Forms follow a predictable structure: `useForm` + internal `isSubmitting`/`submitError` + `client-api` modules + `isApiError` handling. `fieldValidation.ts` centralizes rules — good for reuse.

---

## **Blockers (fix before merge)**

### **1. Password forms call non-existent API routes**

`password-client-api.ts` targets:

- `/api/auth/password-forgot`
- `/api/auth/password-restore`
- `/api/auth/password-change`

Only `login`, `register`, and `logout` exist under `app/api/auth/`. The password forms were refactored to use this client, so **forgot/restore/change will fail at runtime**.

**Fix options:**

- Add Next proxy routes + Express handlers in this PR, or
- Revert password form wiring until Phase 1, or
- Mark routes as stub with clear TODO and disable submit in UI

### **2. Client vs server validation mismatch (username)**

| **Layer**             | **Username rules**                                |
| --------------------- | ------------------------------------------------- |
| `registerInputSchema` | min 1, max 100                                    |
| `USERNAME_VALIDATION` | min 3, max 30, `NAME_PATTERN` (person-name regex) |

Users can pass client validation and fail server-side (or vice versa). `NAME_PATTERN` is also a poor fit for usernames.

**Fix:** Align `USERNAME_VALIDATION` with `registerInputSchema` and add a dedicated `USERNAME_PATTERN` if needed.

### **3.** `errorHandler.ts` **mislabels non-500 errors**

errorHandler.tsLines 23-38

const status = _/_ ... _/_ 500;

const tMessage =

status === 500

? AUTH_T_MESSAGES.INTERNAL_ERROR

: AUTH_T_MESSAGES.VALIDATION_ERROR;

Any non-500 thrown error gets `VALIDATION_ERROR` as `tMessage`, including future 401/409 cases. Prefer mapping by status/code or rethrowing `ApiError` with the correct `tMessage`.

---

## **High priority (should fix in this PR or immediately after)**

### **4. Locale pattern inconsistency**

The new `.cursor/rules/locale-pattern.mdc` says pages pass `locale` down, but several new views break that:

| **File**                 | **Issue**                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `AppView.tsx`            | Uses `getCurrentLangFromPathname()` — page has `params.locale` but doesn't pass it |
| `BackpackView.tsx`       | Same                                                                               |
| `AppDashboard.tsx`       | Manual `/${locale}/create` instead of `buildLocalizedPathname`                     |
| `SignInForm.tsx`         | `<Link href="/password-forgot">` — not localized                                   |
| `GroupAboutPageView.tsx` | `locale: string` instead of `Language`                                             |

`CreatePage` and `LoginPage` do it correctly — new code should match them.

### **5. Duplicate Next auth route handlers**

`app/api/auth/login/route.ts` and `register/route.ts` are ~95% identical. Extract something like:

createAuthSessionRoute({

backendPath: '/api/auth/login',

schema: authLoginApiResponseSchema,

inputSchema: loginInputSchema,

successStatus: 200,

tMessage: AUTH_T_MESSAGES.LOGIN_SUCCESS,

fallbackMessage: 'Login failed',

})

Same for client-side fetch wrappers (below).

### **6. Duplicate client fetch wrappers**

`client-api.ts` and `password-client-api.ts` share the same pattern:

fetch → parseApiErrorPayload → schema safeParse → throw ApiError

Extract a shared helper, e.g. `src/lib/api-client.ts`:

requestApi(path, { method, body, schema })

Then `loginWithCredentials`, `requestPasswordForgot`, etc. become one-liners.

### **7. Double data fetch on group about page**

`app/[locale]/[group]/about/page.tsx` calls `caller.group.getBySlug` in `generateMetadata`, and `GroupAboutPageView` fetches again. Consider React `cache()` around the query or passing data from page → view.

---

## **Medium priority (quality & maintainability)**

### **8. Dead or premature code**

| **Item**                                                       | **Status**                                                                       |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `resolveSubmitError.ts`                                        | Defined, never imported — remove or use                                          |
| `wrapSuccessApiResponse` / `wrapErrorApiResponse`              | Exported, unused — remove or document RTK Query intent                           |
| `optionalAuth`                                                 | Implemented, never wired — fine for Phase 0, but add a comment or first consumer |
| Deprecated aliases in `auth.ts` (`authMeResponseSchema`, etc.) | Added and deprecated in same PR — skip deprecation until rename is needed        |

### **9. Repeated form error handling (6+ copies)**

Every form repeats:

if (isApiError(error)) {

setSubmitError(t`common:${error.tMessage}`, { defaultValue: error.message }));

return;

}

setSubmitError(t('common:error.global'));

The rule says not to use `resolveSubmitError` in forms, but a tiny `useFormApiError(t)` hook would DRY this without breaking the pattern.

### **10. Dual session resolution paths**

- tRPC: `createTRPCContext` → `getAuthSession` → backend `/me`
- tRPC `auth.me`: returns `ctx.user` from the same context

That's fine, but document when to use `caller.auth.me()` vs `getAuthSession()` directly to avoid a third path later.

### **11. Schema fields not yet used**

User model includes `loginAttempts`, `lockUntil`, `resetPasswordToken`, etc., but login doesn't use them. Acceptable for Phase 0 — add TODOs or trim from migration if not planned soon.

### **12. Type coverage gap**

`pnpm typecheck` only runs backend `tsc`. Next app, tRPC routers, and forms aren't typechecked in CI. Worth extending before the codebase grows.

### **13.** `authRouter` **typing**

const userId = (req as AuthenticatedRequest).userId;

Prefer extending Express `Request` globally (you already have `backend/types/express.ts`) so `requireAuth` narrows the type without casts.

---

## **Architecture assessment**

ClientNextBackendFormsClientAPICreateGroupTrpcClientNextAuthRoutesTrpcHandlerBackendFetchCreateTRPCContextMiddlewareCookieAndHeadersExpressAuthExpressMePrismaDirect

**Intentional split:** Auth via REST proxy; groups via tRPC + direct Prisma. That's reasonable for Phase 0, but document it so REST doesn't creep into groups or tRPC into auth without a deliberate decision.

**Reusability score:** 7/10 — contracts and form patterns are strong; fetch/route/locale duplication pulls it down.

**Duplicate-pattern score:** 6/10 — several copy-paste hotspots identified above; none are catastrophic yet.

---

## **Suggested PR checklist**

- Password API routes implemented or password forms reverted/disabled
- Username validation aligned client ↔ server
- `AppView` / `BackpackView` receive `locale` from page params
- Localized links in `SignInForm` and `AppDashboard`
- Extract shared `requestApi` and auth route factory
- Fix `errorHandler` tMessage mapping
- Remove unused `resolveSubmitError` (or adopt it consistently)
- Manual smoke test: register → login → create group → view `/about` → logout
- Run migration on a clean DB

---

## **Verdict**

**Strong foundation PR** with thoughtful contracts, middleware, and domain modeling. The auth cookie bridge and `@repo/api` package are the right long-term investments.

**Do not merge as-is** because password flows are broken and validation/locale inconsistencies will cause bug churn. Address blockers + high-priority items, and this is a good merge into `develop`.

I can turn this into inline PR comments or a concrete refactor plan for the duplication items if you want.
