-- Case-insensitive category names per group (replace exact unique on name)

ALTER TABLE "categories" ADD COLUMN "name_normalized" VARCHAR(100);

UPDATE "categories" SET "name_normalized" = lower("name");

ALTER TABLE "categories" ALTER COLUMN "name_normalized" SET NOT NULL;

DROP INDEX IF EXISTS "categories_group_id_name_key";

CREATE UNIQUE INDEX "categories_group_id_name_normalized_key" ON "categories"("group_id", "name_normalized");
