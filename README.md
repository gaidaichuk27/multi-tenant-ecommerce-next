# Multi-Tenant E-Commerce app (next 15.5.18)

## Node 24.15.0

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
