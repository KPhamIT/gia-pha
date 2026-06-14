-- CreateTable
CREATE TABLE "EventDonation" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "donorName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventDonation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventDonation" ADD CONSTRAINT "EventDonation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
