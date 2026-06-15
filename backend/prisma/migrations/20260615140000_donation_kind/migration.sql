-- CreateEnum
CREATE TYPE "DonationKind" AS ENUM ('MONEY', 'IN_KIND');

-- AlterTable
ALTER TABLE "EventDonation" ADD COLUMN "kind" "DonationKind" NOT NULL DEFAULT 'MONEY';
ALTER TABLE "EventDonation" ADD COLUMN "itemDescription" TEXT;
