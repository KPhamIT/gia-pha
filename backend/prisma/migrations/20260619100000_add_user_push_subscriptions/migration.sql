-- CreateTable
CREATE TABLE "UserPushSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "onesignalSubscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPushSubscription_onesignalSubscriptionId_key" ON "UserPushSubscription"("onesignalSubscriptionId");

-- CreateIndex
CREATE INDEX "UserPushSubscription_userId_idx" ON "UserPushSubscription"("userId");

-- AddForeignKey
ALTER TABLE "UserPushSubscription" ADD CONSTRAINT "UserPushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing single-device subscriptions
INSERT INTO "UserPushSubscription" ("userId", "onesignalSubscriptionId", "createdAt", "updatedAt")
SELECT "id", "onesignalSubscriptionId", NOW(), NOW()
FROM "User"
WHERE "onesignalSubscriptionId" IS NOT NULL;
