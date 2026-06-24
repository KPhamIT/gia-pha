-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "establishedYear" TEXT;
ALTER TABLE "Organization" ADD COLUMN "clanAddress" TEXT;

UPDATE "Organization"
SET "clanAddress" = 'Việt Nam'
WHERE "clanAddress" IS NULL;

UPDATE "Organization"
SET "establishedYear" = EXTRACT(YEAR FROM "createdAt")::TEXT
WHERE "establishedYear" IS NULL;
