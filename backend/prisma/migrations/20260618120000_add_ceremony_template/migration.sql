-- CreateTable
CREATE TABLE "CeremonyTemplate" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CeremonyTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CeremonyTemplate_organizationId_isDefault_idx" ON "CeremonyTemplate"("organizationId", "isDefault");

-- AddForeignKey
ALTER TABLE "CeremonyTemplate" ADD CONSTRAINT "CeremonyTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
