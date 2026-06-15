-- AlterTable
ALTER TABLE "EventContribution" ADD COLUMN "amountPaid" INTEGER NOT NULL DEFAULT 0;

-- Backfill existing fully-paid rows from the event's fixed amount.
UPDATE "EventContribution" AS ec
SET "amountPaid" = e."amountPerPerson"
FROM "Event" AS e
WHERE ec."eventId" = e."id"
  AND ec."paid" = true
  AND e."amountPerPerson" > 0;
