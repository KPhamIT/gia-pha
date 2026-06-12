-- AlterTable
ALTER TABLE "Person" ADD COLUMN "deathDate" TIMESTAMP(3),
ADD COLUMN "birthPlace" TEXT,
ADD COLUMN "currentLocation" TEXT,
ADD COLUMN "education" TEXT,
ADD COLUMN "occupation" TEXT,
ADD COLUMN "religion" TEXT,
ADD COLUMN "ethnicity" TEXT,
ADD COLUMN "achievements" TEXT;

-- CreateTable
CREATE TABLE "Biography" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Biography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraveInfo" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "cemetery" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraveInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Biography_personId_key" ON "Biography"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "GraveInfo_personId_key" ON "GraveInfo"("personId");

-- AddForeignKey
ALTER TABLE "Biography" ADD CONSTRAINT "Biography_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraveInfo" ADD CONSTRAINT "GraveInfo_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
