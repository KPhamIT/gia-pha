-- CreateEnum
CREATE TYPE "ExportSystemAssetCategory" AS ENUM ('BACKGROUND', 'SCROLL', 'COUPLET', 'OTHER');

-- CreateEnum
CREATE TYPE "ExportSystemAssetAccess" AS ENUM ('FREE', 'PAID');

-- CreateTable
CREATE TABLE "ExportSystemAsset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ExportSystemAssetCategory" NOT NULL DEFAULT 'OTHER',
    "access" "ExportSystemAssetAccess" NOT NULL DEFAULT 'FREE',
    "provider" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "uploadedByUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExportSystemAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExportSystemAsset_storageKey_key" ON "ExportSystemAsset"("storageKey");

-- CreateIndex
CREATE INDEX "ExportSystemAsset_isActive_category_sortOrder_idx" ON "ExportSystemAsset"("isActive", "category", "sortOrder");

-- AddForeignKey
ALTER TABLE "ExportSystemAsset" ADD CONSTRAINT "ExportSystemAsset_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
