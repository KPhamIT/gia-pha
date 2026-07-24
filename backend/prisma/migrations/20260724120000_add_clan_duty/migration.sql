-- CreateTable
CREATE TABLE "ClanDutyYear" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClanDutyYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClanDutyEntry" (
    "id" SERIAL NOT NULL,
    "dutyYearId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "role" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "ClanDutyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClanDutyYear_organizationId_year_idx" ON "ClanDutyYear"("organizationId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ClanDutyYear_organizationId_year_key" ON "ClanDutyYear"("organizationId", "year");

-- CreateIndex
CREATE INDEX "ClanDutyEntry_dutyYearId_sortOrder_idx" ON "ClanDutyEntry"("dutyYearId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ClanDutyEntry_dutyYearId_personId_key" ON "ClanDutyEntry"("dutyYearId", "personId");

-- AddForeignKey
ALTER TABLE "ClanDutyYear" ADD CONSTRAINT "ClanDutyYear_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanDutyEntry" ADD CONSTRAINT "ClanDutyEntry_dutyYearId_fkey" FOREIGN KEY ("dutyYearId") REFERENCES "ClanDutyYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClanDutyEntry" ADD CONSTRAINT "ClanDutyEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
