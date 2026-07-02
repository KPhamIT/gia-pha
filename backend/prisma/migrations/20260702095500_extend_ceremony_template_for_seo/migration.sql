-- AlterTable
ALTER TABLE "CeremonyTemplate"
ADD COLUMN     "intro" TEXT,
ADD COLUMN     "meaning" TEXT,
ADD COLUMN     "preparation" TEXT,
ADD COLUMN     "sourceBookTitle" TEXT,
ADD COLUMN     "seoSlug" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "seoDescription" VARCHAR(320),
ADD COLUMN     "seoExcerpt" TEXT,
ADD COLUMN     "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "CeremonyTemplate_organizationId_seoSlug_idx" ON "CeremonyTemplate"("organizationId", "seoSlug");
