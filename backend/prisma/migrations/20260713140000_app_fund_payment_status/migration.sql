-- CreateEnum
CREATE TYPE "AppFundContributionStatus" AS ENUM ('AWAITING_REVIEW', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "OrgAppFundContribution" ADD COLUMN "status" "AppFundContributionStatus" NOT NULL DEFAULT 'AWAITING_REVIEW';
ALTER TABLE "OrgAppFundContribution" ADD COLUMN "transferCode" TEXT;
ALTER TABLE "OrgAppFundContribution" ADD COLUMN "reviewedAt" TIMESTAMP(3);
ALTER TABLE "OrgAppFundContribution" ADD COLUMN "reviewedByUserId" INTEGER;
ALTER TABLE "OrgAppFundContribution" ADD COLUMN "reviewNote" TEXT;

-- Khoản đã ghi trước khi có duyệt → coi như đã xác nhận
UPDATE "OrgAppFundContribution" SET "status" = 'CONFIRMED' WHERE "transferCode" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrgAppFundContribution_transferCode_key" ON "OrgAppFundContribution"("transferCode");
CREATE INDEX "OrgAppFundContribution_organizationId_status_createdAt_idx" ON "OrgAppFundContribution"("organizationId", "status", "createdAt");
CREATE INDEX "OrgAppFundContribution_status_createdAt_idx" ON "OrgAppFundContribution"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "OrgAppFundContribution" ADD CONSTRAINT "OrgAppFundContribution_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
