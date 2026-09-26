-- Community feed categories + optional posts.category_id

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "permissions" VARCHAR(50) NOT NULL DEFAULT 'all_members',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_group_id_sort_order_idx" ON "categories"("group_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "categories_group_id_name_key" ON "categories"("group_id", "name");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN "category_id" TEXT;

-- CreateIndex
CREATE INDEX "posts_group_id_category_id_idx" ON "posts"("group_id", "category_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
