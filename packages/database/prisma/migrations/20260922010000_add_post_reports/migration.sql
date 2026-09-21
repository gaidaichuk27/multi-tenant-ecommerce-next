-- Post reports (member report + admin moderation queue)

-- CreateEnum
CREATE TYPE "PostReportStatus" AS ENUM ('open', 'resolved', 'dismissed');

-- CreateTable
CREATE TABLE "post_reports" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason" TEXT,
    "status" "PostReportStatus" NOT NULL DEFAULT 'open',
    "resolver_id" TEXT,
    "resolve_note" TEXT,
    "resolved_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "post_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_reports_group_id_status_created_at_idx" ON "post_reports"("group_id", "status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "post_reports_post_id_idx" ON "post_reports"("post_id");

-- CreateIndex
CREATE INDEX "post_reports_reporter_id_idx" ON "post_reports"("reporter_id");

-- One open report per reporter per post; re-report allowed after resolve/dismiss
CREATE UNIQUE INDEX "post_reports_post_id_reporter_id_open_key"
    ON "post_reports"("post_id", "reporter_id")
    WHERE "status" = 'open';

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_resolver_id_fkey" FOREIGN KEY ("resolver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
