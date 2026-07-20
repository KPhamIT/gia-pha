-- CreateTable
CREATE TABLE "DayNote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "noteDate" DATE NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DayNote_userId_noteDate_idx" ON "DayNote"("userId", "noteDate");

-- CreateIndex
CREATE UNIQUE INDEX "DayNote_userId_noteDate_key" ON "DayNote"("userId", "noteDate");

-- AddForeignKey
ALTER TABLE "DayNote" ADD CONSTRAINT "DayNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
