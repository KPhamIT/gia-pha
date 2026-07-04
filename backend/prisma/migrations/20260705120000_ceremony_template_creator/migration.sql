-- AlterTable
ALTER TABLE "CeremonyTemplate" ADD COLUMN "createdByUserId" INTEGER,
ADD COLUMN "isSystemTemplate" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "CeremonyTemplate" ADD CONSTRAINT "CeremonyTemplate_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "CeremonyTemplate_isSystemTemplate_idx" ON "CeremonyTemplate"("isSystemTemplate");
CREATE INDEX "CeremonyTemplate_createdByUserId_idx" ON "CeremonyTemplate"("createdByUserId");

-- Mẫu sẵn có coi là mẫu hệ thống; gán quyền sửa cho tài khoản SYSTEM nếu có.
UPDATE "CeremonyTemplate" SET "isSystemTemplate" = true;

UPDATE "CeremonyTemplate"
SET "createdByUserId" = (
  SELECT "id" FROM "User" WHERE "role" = 'SYSTEM' ORDER BY "id" ASC LIMIT 1
)
WHERE "isSystemTemplate" = true
  AND "createdByUserId" IS NULL;
