-- AlterTable
ALTER TABLE "Person" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Person" ADD COLUMN "lastEditedByUserId" INTEGER;

-- CreateTable
CREATE TABLE "PersonEditLog" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonEditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Person_lastEditedByUserId_idx" ON "Person"("lastEditedByUserId");

-- CreateIndex
CREATE INDEX "PersonEditLog_personId_editedAt_idx" ON "PersonEditLog"("personId", "editedAt" DESC);

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_lastEditedByUserId_fkey" FOREIGN KEY ("lastEditedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonEditLog" ADD CONSTRAINT "PersonEditLog_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonEditLog" ADD CONSTRAINT "PersonEditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
