-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FAMILY', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BillingOrderStatus" AS ENUM ('PENDING_PAYMENT', 'AWAITING_REVIEW', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "BillingOrder" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "transferCode" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "personCountAtOrder" INTEGER NOT NULL,
    "amountVnd" INTEGER NOT NULL,
    "status" "BillingOrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "note" TEXT,
    "paidAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedByUserId" INTEGER,
    "reviewNote" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSubscription" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "personCountAtPurchase" INTEGER NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "amountVnd" INTEGER NOT NULL,
    "billingOrderId" INTEGER,
    "paymentRef" TEXT,
    "activatedByUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingOrder_transferCode_key" ON "BillingOrder"("transferCode");

-- CreateIndex
CREATE INDEX "BillingOrder_organizationId_status_idx" ON "BillingOrder"("organizationId", "status");

-- CreateIndex
CREATE INDEX "BillingOrder_status_createdAt_idx" ON "BillingOrder"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSubscription_billingOrderId_key" ON "OrganizationSubscription"("billingOrderId");

-- CreateIndex
CREATE INDEX "OrganizationSubscription_organizationId_status_expiresAt_idx" ON "OrganizationSubscription"("organizationId", "status", "expiresAt");

-- AddForeignKey
ALTER TABLE "BillingOrder" ADD CONSTRAINT "BillingOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingOrder" ADD CONSTRAINT "BillingOrder_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSubscription" ADD CONSTRAINT "OrganizationSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSubscription" ADD CONSTRAINT "OrganizationSubscription_billingOrderId_fkey" FOREIGN KEY ("billingOrderId") REFERENCES "BillingOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSubscription" ADD CONSTRAINT "OrganizationSubscription_activatedByUserId_fkey" FOREIGN KEY ("activatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
