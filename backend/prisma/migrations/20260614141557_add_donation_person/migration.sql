-- AlterTable
ALTER TABLE "EventDonation" ADD COLUMN     "personId" INTEGER;

-- AddForeignKey
ALTER TABLE "EventDonation" ADD CONSTRAINT "EventDonation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
