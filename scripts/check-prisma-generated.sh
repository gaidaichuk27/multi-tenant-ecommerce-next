#!/usr/bin/env sh
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GENERATED_CLIENT="$ROOT/packages/database/src/generated/client"

if [ ! -d "$GENERATED_CLIENT" ]; then
    echo "Prisma client is missing. Run: pnpm db:generate" >&2
    exit 1
fi
