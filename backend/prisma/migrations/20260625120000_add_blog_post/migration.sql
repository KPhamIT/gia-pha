-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('BASICS', 'HOWTO', 'CULTURE', 'FAMILY_TREE', 'ONLINE');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaDescription" VARCHAR(320) NOT NULL,
    "category" "BlogCategory" NOT NULL,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_published_publishedAt_idx" ON "BlogPost"("published", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "BlogPost_category_published_idx" ON "BlogPost"("category", "published");
