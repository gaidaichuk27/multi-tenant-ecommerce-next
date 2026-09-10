# Multi-Tenant E-Commerce app (next 15.5.18)

## Node 24.15.0 · pnpm 10.15.0

## Implementation status — Skool communities (Phase 0)

Full product roadmap: [`docs/SKOOL_CLONE_PLAN.md`](docs/SKOOL_CLONE_PLAN.md).

**Phase 0 goal:** User can sign up, create a group, and view a public about page.

### Done in this branch

| Area                | What shipped                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Database**        | Prisma models `User`, `Group`, `GroupMembership`, `GroupSettings`; migration `20260702120000_phase_0_foundation`          |
| **Express auth**    | Register, login, me, verify-email, resend-verification, password-forgot/restore/change (JWT + mailer)                     |
| **Auth hardening**  | Single-use reset tokens, `tokenVersion` session revoke, login lockout, rate limits, shared password policy                |
| **Next auth proxy** | `app/api/auth/{register,login,logout,me,verify-email,resend-verification,password-*}/route.ts` → Express                  |
| **API contracts**   | `@repo/api` — `auth.ts`, `groups.ts`, `response.ts` (Zod inputs, `sendApiSuccess` / `parseApiErrorPayload`, `isApiError`) |
| **tRPC**            | `auth.me`, `group.create`, `group.getBySlug`, `group.listMine` in `src/TRPC/routers/`                                     |
| **Middleware**      | Locale routing, guest-only vs protected routes, `x-group-slug` for `/{group}/*` pages (`middleware.ts`)                   |
| **Pages**           | `/login`, `/register`, `/app`, `/backpack`, `/create`, `/{group}/about`, verify-email + password flows                    |
| **Forms**           | `RegisterForm`, `SignInForm`, `CreateGroupForm`, password forms — unified `useForm` + `client-api` pattern                |
| **Client APIs**     | `src/lib/auth/client-api.ts`, `src/lib/groups/client-api.ts` (browser tRPC for groups)                                    |
| **Locale**          | `locale: Language` passed from page `params` → view → form (not parsed from pathname)                                     |
| **Cursor rules**    | `.cursor/rules/` — forms, locale, auth middleware, API contracts                                                          |

### Phase 0 exit criteria — remaining

| Item                    | Notes                                           |
| ----------------------- | ----------------------------------------------- |
| `superjson` transformer | Planned in Phase 0 deps; not wired yet          |
| `/settings` shell       | Route reserved in middleware; page not built    |
| Dedicated logout page   | Cookie cleared via API; full `/logout` flow TBD |

### Auth follow-up (separate pass — not blocking local Phase 0)

Security review items for email verification + password flows are closed in this branch
(open-redirect guard, sensitive rate limits, single-use reset consume, session checks on
protected views, etc.). **Defer to a dedicated production-hardening pass** (tracked as
checkboxes in [`docs/SKOOL_CLONE_PLAN.md`](docs/SKOOL_CLONE_PLAN.md) §6 Phase 0 deferred +
Phase 7 **Auth rate limits**, and MVP deploy gate):

| Item                                      | Why                                                                                                                                                                                       | Priority          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Shared rate-limit store (Redis)**       | `express-rate-limit` is still in-memory — counters reset per process and do not share across instances. **Deploy blocker** before multi-instance / load-balanced production.              | High              |
| **`TRUST_PROXY` in prod**                 | Backend sets `trust proxy` when `TRUST_PROXY=1` or `NODE_ENV=production`; confirm reverse-proxy config so rate-limit keys use real client IPs.                                            | High (with Redis) |
| **Stateful email-verify tokens**          | Verify links are still purpose JWTs without DB single-use revoke (unlike password reset). Align with hashed reset-token pattern when convenient.                                          | Medium            |
| **Consolidate Next auth route factories** | `create-auth-proxy-route`, `create-auth-session-route`, and `password-change/route.ts` still overlap — refactor after ship.                                                               | Low               |
| **Dev email-template preview URL**        | Add a gated Express (or Next) controller to render mailer HTML in the browser without sending — see [`docs/SKOOL_CLONE_PLAN.md`](docs/SKOOL_CLONE_PLAN.md) §6 Phase 0 _Mailer follow-up_. | Low (DX)          |

`changePasswordEmail` template + best-effort send on password change are already in the mailer layer; the preview controller is the remaining DX item.

Wire `rate-limit-redis` (or equivalent) when standing up shared cache (Docker Redis → ElastiCache).

### Auth product policy

- Login is allowed before email confirmation.
- Sensitive mutations (e.g. `group.create`) require `isEmailConfirmed` via tRPC `verifiedEmailProcedure` / Express `requireVerifiedEmail`.
- Access JWTs embed `tokenVersion`; password change/restore bumps it and invalidates other sessions.
- Password reset JWTs are stored hashed on the user row and cleared after a successful restore (single-use).

### Key paths

```
app/[locale]/(Auth)/login|register/     # auth pages
app/[locale]/(App)/app|backpack|create/ # platform shell
app/[locale]/[group]/about/             # public group about
app/api/auth/                           # Next → Express auth proxy
app/api/trpc/[trpc]/                    # tRPC handler
backend/routers/authRouter.ts           # register / login / me
src/TRPC/routers/group.ts               # group procedures
src/features/forms/                     # auth + password forms
src/features/create-group/              # CreateGroupForm
src/lib/auth/client-api.ts              # browser auth fetch
src/lib/groups/client-api.ts            # browser group tRPC
packages/api/src/                       # shared Zod + response helpers
packages/database/prisma/               # schema + migrations
```

### Auth env (required for Phase 0)

Add to **`backend/.env`** (in addition to `PORT` / `STOREFRONT_URL`):

```env
JWT_TOKEN=your-long-random-secret
```

Without `JWT_TOKEN`, register/login will fail at token signing.

---

## Quick reference — run commands

### First-time setup

```bash
git clone <repo-url>
cd multi-tenant-ecommerce-next
pnpm install
```

Create **root `.env`** (required):

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/multi-tenant
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Create **`backend/.env`** (required for Express):

```env
PORT=8080
STOREFRONT_URL=http://localhost:3000
```

Then sync Prisma (pick one path):

```bash
pnpm db:generate              # always — after schema changes or first clone
pnpm db:migrate:deploy        # apply committed migrations (CI / shared DB)
# OR for local schema iteration only:
pnpm db:push                  # solo dev — no migration files
# OR create a new migration:
pnpm db:migrate               # team dev: create + apply migration
```

> **Existing database before migrations were added?** Mark the baseline as applied once:
> `pnpm exec dotenv -e .env -- prisma migrate resolve --applied 20260624120000_init_test_users --schema packages/database/prisma/schema.prisma`

---

### Local development (no Docker)

| Command            | What it does                                                         |
| ------------------ | -------------------------------------------------------------------- |
| `pnpm dev`         | Start **Next.js** (`:3000`) + **Express backend** (`:8080`) together |
| `pnpm dev:next`    | Next.js only                                                         |
| `pnpm dev:backend` | Express API only                                                     |
| `pnpm build`       | Production build (Next.js)                                           |
| `pnpm start`       | Run production Next.js server                                        |

**URLs**

| Service       | URL                                                        |
| ------------- | ---------------------------------------------------------- |
| Next.js app   | http://localhost:3000                                      |
| Express API   | http://localhost:8080                                      |
| Prisma Studio | http://localhost:5555 (`pnpm db:studio`)                   |
| pgAdmin 4     | Desktop app — see [pgAdmin 4](#browse-data-with-pgadmin-4) |

**Verify**

```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/health/db
```

**Data flow:** Browser → tRPC (Next) → `fetch` → Express `/api/*` → Prisma → PostgreSQL (`localhost:5432`).

---

### Docker development

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

| Command                      | What it does                                          |
| ---------------------------- | ----------------------------------------------------- |
| `pnpm run multi dev up`      | **Recommended** — install, `db:generate`, start stack |
| `pnpm docker:dev`            | Same as `multi dev up`                                |
| `pnpm docker:dev:down`       | Stop containers (graceful)                            |
| `pnpm docker:dev:down:force` | Kill + remove containers immediately                  |
| `pnpm docker:dev:logs`       | Follow dev container logs                             |

**Default:** uses your **host Postgres** on `:5432` (same `DATABASE_URL` as local dev). Containers connect via `host.docker.internal`.

**Optional isolated Postgres** (separate empty DB on `:5433`, runs `db:migrate:deploy`):

```bash
DOCKER_USE_BUNDLED_POSTGRES=1 pnpm run multi dev up
```

**Docker URLs** — same as local: Next `http://localhost:3000`, API `http://localhost:8080`.

**Reset Docker volumes** (bundled Postgres / cached `node_modules` only):

```bash
docker compose --profile dev --profile dev-db down -v --remove-orphans --timeout 0
```

See `.env.docker.example` for Docker-specific overrides.

---

### Database (Prisma)

All commands run from the **repo root**.

| Command                  | When to use                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| `pnpm db:generate`       | After every `schema.prisma` change                               |
| `pnpm db:migrate`        | Local dev — create + apply migration                             |
| `pnpm db:migrate:deploy` | CI / production — apply pending migrations                       |
| `pnpm db:push`           | Quick local sync (no migration files)                            |
| `pnpm db:pull`           | Introspect existing DB → update `schema.prisma`                  |
| `pnpm db:studio`         | Open Prisma Studio GUI                                           |
| pgAdmin 4                | Browse PostgreSQL — see [pgAdmin 4](#browse-data-with-pgadmin-4) |
| `pnpm typecheck`         | `db:generate` + backend typecheck                                |
| `pnpm typecheck:backend` | Typecheck Express API only                                       |

**Production Docker (Next UI + Express API):**

```bash
docker compose --profile prod up --build app api
```

Requires root `.env` with `DATABASE_URL` (and `backend/.env` for API secrets). The `app` service waits for `api`.

**After editing `schema.prisma` (team workflow):**

```bash
pnpm db:migrate
```

---

### Database migration workflow

A **migration** is a versioned SQL file in git that records how the database schema changed:

```
packages/database/prisma/migrations/
└── 20260624120000_init_test_users/
    └── migration.sql
```

Prisma tracks applied migrations in the `_prisma_migrations` table. This keeps schema changes **reproducible** across teammates, CI, and production.

#### When do you need a migration?

| Situation                                                 | Action                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| You **changed** `schema.prisma` (new model, field, index) | Create a **new** migration (`pnpm db:migrate`)                        |
| You **pulled** code with new migration folders            | **Apply** migrations (`pnpm db:migrate` or `pnpm db:migrate:deploy`)  |
| You only changed **data** (rows in pgAdmin)               | No migration                                                          |
| You only changed **app code** (React, Express)            | No migration                                                          |
| Fresh clone, DB already matches schema                    | `pnpm db:generate` (and `migrate resolve` once if needed — see below) |
| Solo throwaway local DB, history not needed               | `pnpm db:push` is OK — **not** for team/production                    |

**Rule:** If you edit `packages/database/prisma/schema.prisma`, use **`pnpm db:migrate`** for team work. Use `pnpm db:push` only for quick solo experiments.

#### Command cheat sheet

| Command                  | What it does                                                           | When to use                         |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------------------- |
| `pnpm db:migrate`        | Creates migration SQL + applies to **your local** DB + runs `generate` | You changed the schema locally      |
| `pnpm db:migrate:deploy` | Applies **existing** migration files only                              | CI, production, after `git pull`    |
| `pnpm db:generate`       | Updates Prisma TypeScript client — **does not change the DB**          | After schema changes or fresh clone |
| `pnpm db:push`           | Syncs schema to DB without migration files                             | Solo local prototyping only         |

#### Workflow A — You change the schema (normal team flow)

1. Edit `packages/database/prisma/schema.prisma`
2. Create and apply the migration:

```bash
pnpm db:migrate
```

Prisma prompts for a name (e.g. `add_posts_table`).

3. Commit schema **and** migration files:

```bash
git add packages/database/prisma/
git commit -m "feat(database): add posts table"
```

4. Teammates / CI / deploy — after pull:

```bash
pnpm install
pnpm db:migrate:deploy
pnpm db:generate
```

#### Workflow B — You pulled code with new migrations (you did not edit schema)

```bash
pnpm install
pnpm db:migrate          # local dev
# OR in CI / production:
pnpm db:migrate:deploy
```

#### Workflow C — Table existed before migrations were added (baseline)

If the table already exists in Postgres (e.g. created in pgAdmin) and the repo has
`20260624120000_init_test_users`, mark it as applied **once** so Prisma does not try to
`CREATE TABLE` again:

```bash
cd packages/database
dotenv -e ../../.env -- prisma migrate resolve --applied 20260624120000_init_test_users
cd ../..
pnpm db:generate
```

Use normal `pnpm db:migrate` for all future schema changes.

#### Workflow D — Brand-new empty database

**Recommended (migrations):**

```bash
pnpm install
pnpm db:migrate:deploy
pnpm db:generate
```

**Quick local only (no migration history):**

```bash
pnpm db:generate
pnpm db:push
```

#### What `pnpm db:migrate` does internally

1. Compares `schema.prisma` to the current database
2. Writes SQL to `prisma/migrations/<timestamp>_<name>/migration.sql`
3. Runs that SQL on your database
4. Records it in `_prisma_migrations`
5. Runs `prisma generate` (updates `packages/database/src/generated/client`)

#### Decision tree

```
Did you change schema.prisma?
├─ NO  → Did you pull new migration folders?
│         ├─ YES → pnpm db:migrate (local) or pnpm db:migrate:deploy (CI/prod)
│         └─ NO  → nothing (maybe pnpm db:generate if types feel stale)
└─ YES → pnpm db:migrate → commit schema + migrations/
```

#### Daily habits

| Activity           | Command                                                |
| ------------------ | ------------------------------------------------------ |
| Start coding       | `pnpm dev` (`predev` runs `db:generate` automatically) |
| Change schema      | `pnpm db:migrate` → commit migrations                  |
| Deploy / shared DB | `pnpm db:migrate:deploy`                               |
| Browse data        | `pnpm db:studio`                                       |

---

### Requirements

- Node.js `24.15.0`
- pnpm `10.15.0`
- PostgreSQL running locally (for both local and default Docker dev)
- Optional: [direnv](https://direnv.net) — `direnv allow` loads `bin/multi` CLI via `.envrc`

---

## Getting started (new teammates)

This repo is a **pnpm monorepo**:

| Package       | Path                 | Role                              |
| ------------- | -------------------- | --------------------------------- |
| Next.js app   | `.`                  | UI, tRPC BFF layer                |
| Express API   | `backend/`           | REST API, talks to the database   |
| Shared DB     | `packages/database/` | Prisma schema, client, migrations |
| API contracts | `packages/api/`      | Zod schemas shared by API + UI    |

**Data flow today:** UI → tRPC (Next) → `fetch` → Express (`/api/users`) → Prisma → PostgreSQL.

Only the **backend** and **Prisma CLI** use the database directly. The Next.js app does not import `@repo/database`.

### Prerequisites

1. **Node.js** `24.15.0` (use [nvs](https://github.com/jasongin/nvs) or nvm)
2. **pnpm** `10.15.0` (`corepack enable && corepack prepare pnpm@10.15.0 --activate`)
3. **PostgreSQL** running locally (or a remote instance you can reach)
4. Optional: [direnv](https://direnv.net) — loads `bin/` into PATH via `.envrc`

### 1. Clone and install

```bash
git clone <repo-url>
cd multi-tenant-ecommerce-next
pnpm install
```

Run `pnpm install` from the **repo root** — it links all workspace packages (`backend`, `@repo/database`, Next app).

> If install fails on Prisma engine builds, approve build scripts when prompted:
> `pnpm approve-builds` and allow `@prisma/client`, `@prisma/engines`, `prisma`.

### 2. Environment variables

Create env files from the templates below. **Never commit real secrets.**

#### Root `.env` (required)

Used by Prisma CLI, Next.js, and the backend (via `dotenv` in `backend/server.ts`).

```env
# PostgreSQL connection (required for Prisma + backend)
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/multi-tenant

# Next.js → Express
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:3000
```

See `packages/database/.env.example` for a sample `DATABASE_URL` format.

#### `backend/.env` (required for Express)

```env
PORT=8080
BASE_URL=http://localhost:8080
STOREFRONT_URL=http://localhost:3000

# Auth / mailer (add when implementing those features)
JWT_TOKEN=your-secret
MAILER_ADDRESS=you@example.com
MAILER_SECRET=your-app-password
```

| Variable                  | Read by                          | Purpose                              |
| ------------------------- | -------------------------------- | ------------------------------------ |
| `DATABASE_URL`            | Prisma, backend                  | PostgreSQL connection string         |
| `BACKEND_URL`             | Next server (`backendClient.ts`) | Express base URL (server-side fetch) |
| `NEXT_PUBLIC_BACKEND_URL` | Next client (if needed later)    | Public backend URL                   |
| `NEXT_PUBLIC_API_URL`     | tRPC HTTP client                 | Next.js API (`/api/trpc`)            |
| `PORT` / `STOREFRONT_URL` | Express                          | API port and CORS origin             |

**How env loading works**

| Tool         | Package          | What it does                                           |
| ------------ | ---------------- | ------------------------------------------------------ |
| `dotenv`     | `backend`        | Loads root `.env` + `backend/.env` when Express starts |
| `dotenv-cli` | `@repo/database` | Injects root `.env` into one-off Prisma CLI commands   |
| Built-in     | Next.js          | Reads root `.env` automatically — no extra package     |

There is **no** `packages/database/.env` by design. Prisma scripts point at the root file: `dotenv -e ../../.env -- prisma ...`.

### 3. Database setup (first time)

#### Option A — Database already exists (e.g. table created in pgAdmin)

If `test_users` already exists and matches `packages/database/prisma/schema.prisma`:

```bash
pnpm db:generate
pnpm db:studio      # optional: browse data in a GUI
```

If the repo already has migration files for that table, also run the [baseline step](#workflow-c--table-existed-before-migrations-were-added-baseline) once.

#### Option B — Fresh local PostgreSQL

```bash
# 1. Create database (psql or pgAdmin)
createdb multi-tenant

# 2. Apply migrations (preferred for team / production)
pnpm db:migrate:deploy
pnpm db:generate

# OR quick solo prototype only:
pnpm db:push
```

#### Option C — Pull schema from an existing DB

```bash
pnpm db:pull        # introspect DB → updates schema.prisma
pnpm db:generate
```

### Browse data with pgAdmin 4

[pgAdmin 4](https://www.pgadmin.org/) is a desktop GUI for PostgreSQL. Use it to inspect tables, run SQL, and browse rows alongside (or instead of) Prisma Studio.

#### Start pgAdmin 4 (macOS)

1. Open **Applications** → **pgAdmin 4**, or press **⌘ Space** and type `pgAdmin 4`.
2. On first launch, pgAdmin may ask you to set a **master password** for saved server passwords — this is pgAdmin-only, not your Postgres password.
3. Ensure PostgreSQL is running before connecting:

```bash
pg_isready -h localhost -p 5432
# expected: localhost:5432 - accepting connections
```

#### Connect to the project database

This repo uses the database name **`multi-tenant`** on `localhost:5432`. Credentials come from root **`.env`** → `DATABASE_URL`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/multi-tenant
```

Use **`USER`** and **`PASSWORD`** from that URL — not necessarily the default `postgres` superuser.

> **Homebrew PostgreSQL on macOS:** the DB user is often your macOS username (e.g. `macbookpro`), while pgAdmin’s default server entry tries `postgres`. If pgAdmin prompts for the `postgres` password and you do not know it, register a **new** server with the same user/password as `DATABASE_URL`.

**Register a server in pgAdmin:**

1. Right-click **Servers** → **Register** → **Server…**
2. **General** tab — **Name:** `Local PostgreSQL` (any label)
3. **Connection** tab:
    - **Host:** `localhost`
    - **Port:** `5432`
    - **Maintenance database:** `multi-tenant`
    - **Username:** from `DATABASE_URL` (the `USER` segment)
    - **Password:** from `DATABASE_URL` (the `PASSWORD` segment)
4. Enable **Save password** → **Save**

Expand **Servers → Local PostgreSQL → Databases → multi-tenant → Schemas → public → Tables** to browse project tables.

#### Verify the app can reach the same database

```bash
curl http://localhost:8080/api/health/db
# expected: {"ok":true,"userCount":...}
```

If the backend connects but pgAdmin does not, the username or password in pgAdmin does not match root `.env`.

#### Alternative: Prisma Studio (no pgAdmin setup)

```bash
pnpm db:studio
```

Opens http://localhost:5555 with tables filtered to the Prisma schema.

### 4. Prisma commands reference

> **Full step-by-step workflows:** see [Database migration workflow](#database-migration-workflow) in the quick reference above.

All commands are run from the **repo root**. They delegate to `packages/database` and load `DATABASE_URL` from root `.env`.

| Command                  | Prisma equivalent       | When to use                                                                                                 |
| ------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pnpm db:generate`       | `prisma generate`       | After **every** `schema.prisma` change. Regenerates the client in `packages/database/src/generated/client`. |
| `pnpm db:migrate`        | `prisma migrate dev`    | Local dev: create + apply a new migration after schema changes.                                             |
| `pnpm db:migrate:deploy` | `prisma migrate deploy` | CI / production: apply pending migrations only (non-interactive).                                           |
| `pnpm db:push`           | `prisma db push`        | Quick prototype sync — no migration files. Avoid for shared/production DBs.                                 |
| `pnpm db:pull`           | `prisma db pull`        | Introspect an existing database into `schema.prisma`.                                                       |
| `pnpm db:studio`         | `prisma studio`         | Open Prisma Studio GUI at `http://localhost:5555`.                                                          |

**Typical workflow after editing `schema.prisma`:**

```bash
pnpm db:migrate       # dev: name your migration when prompted
pnpm db:generate      # migrate dev runs generate automatically; safe to run again
```

**After pulling latest code with new migrations:**

```bash
pnpm install
pnpm db:migrate:deploy   # production / shared DB
# or locally:
pnpm db:migrate          # applies pending migrations in dev
pnpm db:generate
```

### 5. Prisma package layout

```
packages/database/
├── prisma/
│   └── schema.prisma          # single source of truth for DB schema
├── src/
│   ├── generated/client/      # auto-generated — do not edit
│   └── index.ts               # exports `db` singleton (used by backend)
└── .env.example               # template only, not loaded at runtime
```

- Schema lives in **one place**: `packages/database/prisma/schema.prisma`
- Client output is custom (`../src/generated/client`) so bundlers can resolve the query engine correctly
- Backend imports: `import { db } from '@repo/database'`

### 6. Run the application

From the **repo root**, start Next.js and the Express API together:

```bash
pnpm dev
```

- Next.js → `http://localhost:3000`
- Express API → `http://localhost:8080`

Run a single service only when needed:

```bash
pnpm dev:next      # Next.js only
pnpm dev:backend   # Express API only
```

**Verify backend:**

```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/health/db
```

**Verify full stack:** open `http://localhost:3000` — the test users section loads data via tRPC → backend → Prisma.

#### Docker (Next + backend)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose).

```bash
pnpm run multi dev up     # recommended: full bootstrap + start
# or
pnpm docker:dev           # same as above
pnpm docker:dev:logs      # follow app logs
pnpm docker:dev:down      # stop containers
```

**Default:** Docker uses your **real host Postgres** on port `5432` (same `DATABASE_URL` as local `pnpm dev`). Containers reach it via `host.docker.internal`.

`multi dev up` runs:

1. `pnpm install` (host)
2. `pnpm db:generate`
3. Start Next.js + backend in Docker

| Service     | URL                                                      |
| ----------- | -------------------------------------------------------- |
| Next.js     | http://localhost:3000                                    |
| Express API | http://localhost:8080                                    |
| Database    | Your host Postgres (`localhost:5432`, db `multi-tenant`) |

**Optional isolated Postgres** (empty DB on port `5433`, runs `db:migrate:deploy`):

```bash
DOCKER_USE_BUNDLED_POSTGRES=1 pnpm run multi dev up
```

See `.env.docker.example` for overrides.

### 7. Troubleshooting

| Problem                                                     | Fix                                                                                                                                                             |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot find module '@repo/database'`                       | Run `pnpm install` from repo root. Start backend with `cd backend && pnpm start` (uses local `ts-node`, not global).                                            |
| `Environment variable not found: DATABASE_URL`              | Create root `.env` with `DATABASE_URL=...`. Prisma CLI does not read `backend/.env` alone.                                                                      |
| `Prisma Client could not locate the Query Engine` (Next)    | Run `pnpm db:generate`. Group tRPC uses Prisma via `@repo/database` in the Next server layer.                                                                   |
| `P3014` / shadow database permission error on `db:migrate`  | Postgres user needs `CREATEDB`, or use `pnpm db:push` for local dev, or ask for a shadow DB URL.                                                                |
| `permission denied for table test_users`                    | Grant access: `GRANT ALL ON TABLE test_users TO your_user;` (run as table owner in psql).                                                                       |
| `EADDRINUSE :::8080`                                        | Another process is on port 8080. Stop it or change `PORT` in `backend/.env`.                                                                                    |
| Users empty / error on homepage                             | Ensure backend is running on 8080 and `BACKEND_URL` in root `.env` is correct.                                                                                  |
| Docker dev fails on `pnpm install`                          | Ensure Docker has enough disk/RAM; try `pnpm docker:dev:down -v` and rebuild.                                                                                   |
| Docker cannot reach database                                | Ensure host Postgres is running. Docker uses `host.docker.internal:5432` by default.                                                                            |
| pgAdmin asks for `postgres` password / no `multi-tenant` DB | Register a new server using `USER` + `PASSWORD` from root `.env` `DATABASE_URL`, not the default `postgres` user. See [pgAdmin 4](#browse-data-with-pgadmin-4). |
| `P1000` auth failed on `multi dev up` (bundled mode)        | Reset volume: `docker volume rm multi-tenant-ecommerce-next_postgres_data` and retry with `DOCKER_USE_BUNDLED_POSTGRES=1`.                                      |
| Schema out of sync                                          | `pnpm db:generate` then `pnpm db:migrate` or `pnpm db:push` depending on your workflow.                                                                         |

### 8. Quick checklist for new teammates

- [ ] Node 24.15.0 + pnpm 10.15.0 installed
- [ ] `pnpm install` from repo root
- [ ] Root `.env` with valid `DATABASE_URL`
- [ ] `backend/.env` with `PORT` and `STOREFRONT_URL`
- [ ] `pnpm db:generate` (and `pnpm db:migrate` or `pnpm db:push` if DB is empty)
- [ ] `pnpm dev` (starts Next on :3000 and backend on :8080)
- [ ] `curl http://localhost:8080/api/users` returns JSON

---

## Project history & setup notes

The sections below document how individual features were added over time (linting, tRPC, themes, i18n, etc.).

### 001 - Initial Project setup

- Shadcn init <code>pnpm dlx shadcn@latest init</code> [Shadcn install for next js](https://ui.shadcn.com/docs/installation/next)
- <code>pnpm dlx shadcn@latest add button</code>

### 002 - [Linting configs](https://www.freecodecamp.org/news/how-to-set-up-eslint-prettier-stylelint-and-lint-staged-in-nextjs/#heading-set-up-prettier)

<pre>
    "prettier": "^3.8.3",
    "prettier-plugin-tailwindcss": "^0.8.0",
</pre>

- Prettier config: create <code>.prettierrc.json</code>
      <pre>
      {
      "semi": true,
      "trailingComma": "all",
      "singleQuote": true,
      "printWidth": 80,
      "tabWidth": 4,
      "bracketSameLine": false,
      "singleAttributePerLine": true,
      "arrowParens": "always",
      "bracketSpacing": true,
      "endOfLine": "lf",
      "proseWrap": "preserve",
      "quoteProps": "as-needed",
      "useTabs": false,
      "plugins": ["prettier-plugin-tailwindcss"]
      }
      </pre>

- Prettier config: create <code>.prettierignore</code>
    <pre>
    node_modules
    .next
    .husky
    coverage
    .prettierignore
    .stylelintignore
    .eslintignore
    stories
    storybook-static
    \*.log
    playwright-report
    .nyc_output
    test-results
    junit.xml
    docs
    </pre>

- VSCode settings
    <pre>
    {
    "[typescript]": {
    "editor.tabSize": 4
    },
    
                                                                                      "editor.defaultFormatter": "esbenp.prettier-vscode",
                                                                                      "editor.formatOnSave": true
    
                                                                              }
                                                                              </pre>

- Eslint config
    <pre>
    "@eslint/eslintrc": "^3",
    "@typescript-eslint/eslint-plugin": "^8.59.4",
    "@typescript-eslint/parser": "^8.59.4",
    "eslint": "^9",
    "eslint-config-next": "15.5.18",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-next": "^0.0.0",
    </pre>

- Eslint config: create <code>.eslint.config.mjs</code>

<pre>
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const lintConfig = [
    ...compat.config({
        extends: [
            'next/core-web-vitals',
            'plugin:@typescript-eslint/recommended',
            'prettier',
        ],

        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            '@typescript-eslint/prefer-as-const': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',

            'react-hooks/exhaustive-deps': 'off',

            'no-empty-pattern': 'off',
            'no-unused-vars': 'off',

            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },

        settings: {
            react: {
                version: 'detect',
            },
        },
    }),
];

export default lintConfig;

</pre>

- Husky config

<pre>
    "husky": "^9.1.7",
    "@commitlint/cli": "^21.0.1",
    "@commitlint/config-conventional": "^21.0.1",
    pnpm add -D lint-staged@16

     pnpm approve-builds (optional if fails with git version)
</pre>

1. important to set the .husky in the exact place where .git is placed (to have possibility to execut git-hooks);
2. <code>npm run prepare</code> to initialize pre-commit and pre-push hook;
3. after creating and configuration pre-commit and pre-push important to run execution command for both files to start them work

- pre-commit
      <pre>
      sh .husky/validate-branch-name.sh
      
                                                        pnpm exec lint-staged
                                                      </pre>

- commit-msg
      <pre>
      sh "$(dirname -- "$0")/custom-commit-msg.sh" "$1"
      </pre>

- pre-

                                                      <pre>
                                                        #!/usr/bin/env sh

                                                        . "$(dirname -- "$0")/\_/husky.sh"

                                                            RED='\033[0;31m'
                                                            GREEN='\033[0;32m'
                                                            YELLOW='\033[1;33m'
                                                            NC='\033[0m'

                                                            # Get current branch

                                                            CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

                                                            # Exit if detached HEAD

                                                            [ -z "$CURRENT_BRANCH" ] && exit 0

                                                            # Allowed branch patterns

                                                            ALLOWED_PATTERN="^(feature|bugfix|hotfix|docs)/(frontend|backend|common)-[a-z0-9-]+$"

                                                            # Check branch name

                                                            if ! echo "$CURRENT_BRANCH" | grep -Eq "$ALLOWED_PATTERN"; then
                                                            echo ""

                                                            printf "${RED}❌ Invalid branch name:${NC} %s\n" "$CURRENT_BRANCH"

                                                            echo ""
                                                            printf "${GREEN}✅ Valid format:${NC} <type>/<scope>-<description>\n"

                                                            echo ""
                                                            printf "${YELLOW}Allowed types:${NC} feature | bugfix | hotfix | docs\n"
                                                            printf "${YELLOW}Allowed scopes:${NC} frontend | backend | common\n"
                                                            printf "${YELLOW}Description:${NC} lowercase-with-hyphens\n"

                                                            echo ""
                                                            printf "${GREEN}👉 Example:${NC} feature/frontend-add-login-form\n"
                                                            echo ""

                                                            exit 1
                                                            fi

                                                            exit 0

                                                        </pre>

- custom-commit-msg.sh
  <pre>
  #!/usr/bin/env sh

                                                            MSG_FILE=$1
                                                            OUTPUT=$(pnpm exec commitlint --edit "$MSG_FILE" 2>&1)
                                                            STATUS=$?

                                                            echo "$OUTPUT"

                                                            RED='\033[0;31m'
                                                            GREEN='\033[0;32m'
                                                            NC='\033[0m'

                                                            if [ "$STATUS" -ne 0 ]; then
                                                            echo ""

                                                            printf "${RED}❌ Invalid commit message!${NC}\n"

                                                            echo ""
                                                            echo "✅ Format: <type>(<scope>): <description>"
                                                            echo "   - type: feat | fix | docs | style | refactor | test | chore | revert"
                                                            echo "   - scope: frontend | backend | common"
                                                            echo "   - description: imperative sentence"
                                                            echo ""
                                                            echo "👉 Example: feat(frontend): add login form"
                                                            echo ""

                                                            exit 1
                                                            fi
                                                        </pre>

- validate-branch-name.sh

<pre>
    #!/usr/bin/env sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

[ -z "$CURRENT_BRANCH" ] && exit 0

ALLOWED_PATTERN="^(feature|bugfix|hotfix|docs)/(frontend|backend|common)-[a-z0-9-]+$"

if ! echo "$CURRENT_BRANCH" | grep -Eq "$ALLOWED_PATTERN"; then
  echo ""

  printf "${RED}❌ Invalid branch name:${NC} %s\n" "$CURRENT_BRANCH"

  echo ""

  printf "${GREEN}✅ Format:${NC} <type>/<scope>-<description>\n"

  echo ""
  printf "${YELLOW} - type:${NC} feature | bugfix | hotfix | docs\n"
  printf "${YELLOW} - scope:${NC} frontend | backend | common\n"
  printf "${YELLOW} - description:${NC} lowercase-with-hyphens\n"

  echo ""

  printf "${GREEN}👉 Example:${NC} feature/frontend-add-login-form\n"

  echo ""

  exit 1
fi
</pre>

### Make script executable

<pre>
    <code>chmod +x .husky/commit-msg</code>
    <code>chmod +x .husky/custom-commit-msg.sh</code>
    <code>chmod +x .husky/pre-push</code>
    <code>chmod +x .husky/validate-branch-name.sh</code>
</pre>

- commitlint.config.mjs
    <pre>
    module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
    'scope-enum': [2, 'always', ['frontend', 'backend', 'common']],
    },
    };

</pre>

- lintstagedrc.cjs
      <pre>
      module.exports = {
      '_.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
      '_.{json,md,css}': ['prettier --write'],
      };
      </pre>

### allowed branch-name values

<pre>
    type: feature | bugfix | hotfix | docs
    scope: frontend | backend | common
</pre>

### correct branch name

<pre>
    feature/frontend-add-login-form
</pre>

### allowed commit values:

<pre>
    type: feat | fix | docs | style | refactor | test | chore | revert
    scope: frontend | backend | common
</pre>

### Correct commit messages:

<pre>
    feat(frontend): add login form
    feat(backend): implement user authentication endpoint
    feat(common): create shared validation utilities
</pre>

### next-theme

<pre>
    next-themes
</pre>

### (Theme variants)[https://tweakcn.com/editor/theme]

- Created ThemesProvider:
- Created ActiveThemeProvider
- Created ThemeSelector & ThemeToggle

### Lang Switcher

<pre>
    "country-data-list": "^1.6.3",
    "i18next": "^26.3.1",
    "i18next-resources-to-backend": "^1.2.1",
    "next-i18n-router": "^5.5.8",
    "react-circle-flags": "^0.0.29",
    "react-i18next": "^17.0.8",
</pre>

- Imported svg flags
- Created TranslationProvider
- Created LangSelector

### Login Form functionality

<code>pnpm install use-react-form</code>
<code>pnpm install motion</code>
(Motion primitives animation effects)[https://motion-primitives.com/docs/installation]

<code>npx motion-primitives@latest add text-shimmer-wave</code>
<code>pnpm dlx shadcn@latest add input-group</code>

### tRPC integration (feature/frontend-trpc-setup)

Based on the [tRPC Next.js App Router setup](https://trpc.io/docs/client/nextjs/app-router-setup).

#### 1. Install dependencies

<pre>
pnpm add @trpc/server@11.16.0 @trpc/client@11.16.0 @trpc/tanstack-react-query@11.16.0 @tanstack/react-query@latest zod client-only server-only
</pre>

Packages added:

<pre>
"@tanstack/react-query": "^5.101.0",
"@trpc/client": "11.16.0",
"@trpc/server": "11.16.0",
"@trpc/tanstack-react-query": "11.16.0",
"client-only": "^0.0.1",
"server-only": "^0.0.1",
"zod": "^4.4.3",
</pre>

Optional env (used by the client tRPC HTTP link on the server during SSR):

<pre>
NEXT_PUBLIC_API_URL=http://localhost:3000
</pre>

> **Version note:** tRPC is pinned to `11.16.0`. `11.17.0` introduced a TypeScript regression where `queryOptions` was not inferred correctly on procedures.

#### 2. TypeScript path alias

Add to `tsconfig.json` (use **`@TRPC/*`** for app code — do **not** use `@trpc/*`, it conflicts with npm packages `@trpc/client`, `@trpc/server`, etc.):

<pre>
"@TRPC/*": ["./src/TRPC/*"]
</pre>

#### 3. Files created (in setup order)

**Server core**

| File                           | Purpose                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `src/TRPC/init.ts`             | tRPC init, context, `createTRPCRouter`, `baseProcedure`, `createCallerFactory` |
| `src/TRPC/query-client.ts`     | Shared `QueryClient` factory with SSR dehydrate/hydrate options                |
| `src/TRPC/routers/greeting.ts` | Example sub-router (`greeting.sayHello` query)                                 |
| `src/TRPC/routers/_app.ts`     | Root `appRouter` — merges sub-routers, exports `AppRouter` type                |

**API route**

| File                           | Purpose                                               |
| ------------------------------ | ----------------------------------------------------- |
| `app/api/trpc/[trpc]/route.ts` | Fetch adapter handler (`GET` / `POST`) at `/api/trpc` |

> Keep the API route at `app/api/trpc/` (root), **not** under `app/[locale]/api/trpc/`. The client calls `/api/trpc`; middleware already excludes `/api` from locale redirects.

**Server-side RSC helpers**

| File                  | Purpose                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| `src/TRPC/server.tsx` | `getQueryClient`, `trpc` options proxy, `HydrateClient`, `prefetch`, `caller` |

**Client**

| File                                          | Purpose                                                      |
| --------------------------------------------- | ------------------------------------------------------------ |
| `src/providers/TRPCProvider.tsx`              | `TRPCReactProvider`, `useTRPC` hook, HTTP client for browser |
| `src/features/greeting/ui/ClientGreeting.tsx` | Example client component consuming a tRPC query              |

#### 4. App wiring

**Root layout** — mount the client provider in `app/[locale]/layout.tsx`:

<pre>
import { TRPCReactProvider } from '@providers/TRPCProvider';

&lt;TRPCReactProvider&gt;
  {children}
&lt;/TRPCReactProvider&gt;
</pre>

Use `TRPCReactProvider` (creates query client + tRPC client). Do **not** use the inner `TRPCProvider` directly in the layout — it requires `queryClient` and `trpcClient` props.

**Home page example** — prefetch/fetch on the server and hydrate to the client in `app/[locale]/page.tsx`:

<pre>
import { HydrateClient, getQueryClient, trpc } from '@TRPC/server';
import { ClientGreeting } from '@features/greeting';

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.fetchQuery(trpc.greeting.sayHello.queryOptions());

  return (
    &lt;HydrateClient&gt;
      &lt;ClientGreeting /&gt;
      {/* ...rest of page */}
    &lt;/HydrateClient&gt;
  );
}
</pre>

**Client component example** — `src/features/greeting/ui/ClientGreeting.tsx`:

<pre>
'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@providers/TRPCProvider';

export function ClientGreeting() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.greeting.sayHello.queryOptions());
  return &lt;div&gt;{greeting.data?.[0].hello}&lt;/div&gt;;
}
</pre>

#### 5. Import conventions

| Import                                                       | Resolves to                      |
| ------------------------------------------------------------ | -------------------------------- |
| `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query` | npm packages                     |
| `@TRPC/init`, `@TRPC/server`, `@TRPC/routers/_app`, …        | local app code under `src/TRPC/` |
| `@providers/TRPCProvider`                                    | client provider and `useTRPC`    |

#### 6. Adding a new procedure

1. Create or extend a sub-router in `src/TRPC/routers/` (see `greeting.ts`).
2. Register it in `src/TRPC/routers/_app.ts`.
3. **Server component:** `trpc.myRouter.myProcedure.queryOptions(input)` + `prefetch` / `fetchQuery` / `HydrateClient`.
4. **Client component:** `useQuery(trpc.myRouter.myProcedure.queryOptions(input))` via `useTRPC()`.
5. **Server-only data (no cache hydration):** use `caller` from `src/TRPC/server.tsx`.

#### 7. Troubleshooting

- **`Property 'queryOptions' does not exist`** — check tRPC version is `11.16.0` and path alias is `@TRPC/*` (not `@trpc/*`).
- **`404` on `/api/trpc/...`** — confirm handler exists at `app/api/trpc/[trpc]/route.ts`, not under `[locale]`.
- **Stale `/api/trpc/hello` 404s after renaming procedures** — hard refresh the browser (Cmd+Shift+R) or clear site data; old React Query keys can retry removed routes.
- **`Query data cannot be undefined`** — ensure query handlers `return` a value (not bare `return;`).
