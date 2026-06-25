#!/usr/bin/env sh
# Shared Docker dev env: derive Postgres URLs from root .env DATABASE_URL.
set -e

load_root_env() {
    if [ -f .env ]; then
        set -a
        # shellcheck disable=SC1091
        . ./.env
        set +a
    fi
}

# Default: containers reach the host Postgres on :5432 via host.docker.internal.
# Set DOCKER_USE_BUNDLED_POSTGRES=1 to use the optional Docker Postgres on :5433 instead.
derive_docker_db_env() {
    if [ "${DOCKER_USE_BUNDLED_POSTGRES:-}" = "1" ]; then
        _derive_bundled_docker_db_env
        return 0
    fi

    if [ -z "${DATABASE_URL:-}" ]; then
        echo "DATABASE_URL is missing from .env" >&2
        exit 1
    fi

    eval "$(
        DATABASE_URL="$DATABASE_URL" node <<'NODE'
const raw = process.env.DATABASE_URL;
const normalized = raw.replace(/^postgresql:/, 'http:');
const url = new URL(normalized);
const user = decodeURIComponent(url.username);
const password = decodeURIComponent(url.password);
const database = url.pathname.replace(/^\//, '') || 'multi-tenant';
const host = process.env.DOCKER_DB_HOST || 'host.docker.internal';
const port = url.port || '5432';
const dockerUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

const esc = (value) => JSON.stringify(value);
process.stdout.write(`DOCKER_DATABASE_URL=${esc(dockerUrl)}\n`);
NODE
    )"

    export DOCKER_DATABASE_URL
}

_derive_bundled_docker_db_env() {
    if [ -n "${DOCKER_DATABASE_URL:-}" ] && [ -n "${DOCKER_POSTGRES_USER:-}" ]; then
        export DOCKER_DATABASE_URL DOCKER_POSTGRES_USER DOCKER_POSTGRES_PASSWORD
        return 0
    fi

    if [ -z "${DATABASE_URL:-}" ]; then
        DOCKER_POSTGRES_USER="${DOCKER_POSTGRES_USER:-postgres}"
        DOCKER_POSTGRES_PASSWORD="${DOCKER_POSTGRES_PASSWORD:-postgres}"
        DOCKER_DATABASE_URL="${DOCKER_DATABASE_URL:-postgresql://${DOCKER_POSTGRES_USER}:${DOCKER_POSTGRES_PASSWORD}@localhost:5433/multi-tenant}"
        export DOCKER_POSTGRES_USER DOCKER_POSTGRES_PASSWORD DOCKER_DATABASE_URL
        return 0
    fi

    eval "$(
        DATABASE_URL="$DATABASE_URL" node <<'NODE'
const raw = process.env.DATABASE_URL;
const normalized = raw.replace(/^postgresql:/, 'http:');
const url = new URL(normalized);
const user = decodeURIComponent(url.username);
const password = decodeURIComponent(url.password);
const database = url.pathname.replace(/^\//, '') || 'multi-tenant';
const hostUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost:5433/${database}`;
const containerUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@postgres:5432/${database}`;

const esc = (value) => JSON.stringify(value);
process.stdout.write(
    `DOCKER_POSTGRES_USER=${esc(user)}\n` +
    `DOCKER_POSTGRES_PASSWORD=${esc(password)}\n` +
    `DOCKER_DATABASE_URL=${esc(containerUrl)}\n` +
    `DOCKER_HOST_DATABASE_URL=${esc(hostUrl)}\n`,
);
NODE
    )"

    export DOCKER_POSTGRES_USER DOCKER_POSTGRES_PASSWORD DOCKER_DATABASE_URL DOCKER_HOST_DATABASE_URL
}

run_prisma() {
    # Uses bundled Postgres on host port 5433 (DOCKER_USE_BUNDLED_POSTGRES=1 only).
    (
        cd packages/database
        DATABASE_URL="${DOCKER_HOST_DATABASE_URL:-$DOCKER_DATABASE_URL}" pnpm exec prisma "$@"
    )
}
