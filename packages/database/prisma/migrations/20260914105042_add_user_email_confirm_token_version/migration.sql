-- Corrective migration: columns added to schema.prisma during auth work
-- but missing from 20260702120000_phase_0_foundation.
-- Safe for DBs that already received them via `db push`.

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "token_version" INTEGER NOT NULL DEFAULT 0;
