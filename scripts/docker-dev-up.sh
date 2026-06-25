#!/usr/bin/env sh
# Bootstrap local Docker dev: install deps, optional DB setup, run app stack.
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# shellcheck disable=SC1091
. scripts/docker-env.sh

COMPOSE="docker compose --profile dev"

log() {
    printf '\n==> %s\n' "$1"
}

require_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "Docker is not running. Start Docker Desktop and try again." >&2
        exit 1
    fi
}

wait_for_postgres() {
    log "Waiting for bundled Postgres (user: ${DOCKER_POSTGRES_USER})..."
    i=0
    until docker compose --profile dev-db exec -T postgres sh -c "pg_isready -U \"\$POSTGRES_USER\" -d \"\$POSTGRES_DB\"" >/dev/null 2>&1; do
        i=$((i + 1))
        if [ "$i" -ge 60 ]; then
            echo "Postgres did not become ready in time." >&2
            exit 1
        fi
        sleep 1
    done
}

log "Checking Docker..."
require_docker

load_root_env
derive_docker_db_env

if [ "${DOCKER_USE_BUNDLED_POSTGRES:-}" = "1" ]; then
    log "Database mode: bundled Docker Postgres (:5433)"
    log "Container DATABASE_URL: ${DOCKER_DATABASE_URL}"
else
    log "Database mode: host Postgres (:5432 via host.docker.internal)"
    log "Container DATABASE_URL: ${DOCKER_DATABASE_URL}"
fi

log "Installing dependencies (host)..."
pnpm install

if [ "${DOCKER_USE_BUNDLED_POSTGRES:-}" = "1" ]; then
    log "Starting bundled Postgres..."
    export DOCKER_POSTGRES_USER DOCKER_POSTGRES_PASSWORD
    docker compose --profile dev-db up -d postgres
    wait_for_postgres

    log "Generating Prisma client..."
    run_prisma generate

    log "Applying migrations to bundled database..."
    run_prisma migrate deploy
else
    log "Generating Prisma client (host database)..."
    pnpm db:generate
fi

export DOCKER_DATABASE_URL

log "Starting Next.js + backend (attach logs; Ctrl+C stops app containers)..."
exec $COMPOSE up --build dev
