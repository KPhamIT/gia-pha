-- CreateTable
CREATE TABLE "OrgAppFundContribution" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "personId" INTEGER,
    "donorName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdByUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgAppFundContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrgAppFundContribution_organizationId_createdAt_idx" ON "OrgAppFundContribution"("organizationId", "createdAt");

-- AddForeignKey
ALTER TABLE "OrgAppFundContribution" ADD CONSTRAINT "OrgAppFundContribution_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgAppFundContribution" ADD CONSTRAINT "OrgAppFundContribution_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgAppFundContribution" ADD CONSTRAINT "OrgAppFundContribution_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
