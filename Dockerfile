# syntax=docker/dockerfile:1

FROM node:24.15-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
WORKDIR /app

# --- Shared dependency install (monorepo) ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY packages/database/package.json ./packages/database/
COPY packages/api/package.json ./packages/api/
ENV HUSKY=0
RUN pnpm install --frozen-lockfile

# --- Next.js production app ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/api/node_modules ./packages/api/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

# --- Express API production ---
FROM base AS backend-runner
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY packages/database/package.json ./packages/database/
COPY packages/api/package.json ./packages/api/
ENV HUSKY=0
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/placeholder" pnpm db:generate
WORKDIR /app/backend
EXPOSE 8080
ENV API_PORT=8080
CMD ["pnpm", "start:prod"]

# --- Dev: Next.js + Express backend (docker compose --profile dev up) ---
FROM base AS dev
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY packages/database/package.json ./packages/database/
COPY packages/api/package.json ./packages/api/
ENV HUSKY=0
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000 8080
CMD ["pnpm", "dev"]

# --- Storybook dev (docker compose --profile storybook up storybook) ---
FROM base AS storybook
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY packages/database/package.json ./packages/database/
COPY packages/api/package.json ./packages/api/
ENV HUSKY=0
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 6006
CMD ["pnpm", "exec", "storybook", "dev", "--ci", "-p", "6006", "--host", "0.0.0.0"]
