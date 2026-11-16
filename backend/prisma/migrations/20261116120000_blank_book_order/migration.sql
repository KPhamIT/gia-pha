-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "BlankBookOrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "BlankBookOrder" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "confirmTokenHash" TEXT,
    "status" "BlankBookOrderStatus" NOT NULL DEFAULT 'PENDING',
    "clanName" TEXT NOT NULL,
    "establishedYear" TEXT,
    "clanAddress" TEXT,
    "pageCount" INTEGER NOT NULL,
    "coverIndex" INTEGER NOT NULL DEFAULT 0,
    "amountVnd" INTEGER NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BlankBookOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BlankBookOrder_code_key" ON "BlankBookOrder"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "BlankBookOrder_accessToken_key" ON "BlankBookOrder"("accessToken");
CREATE UNIQUE INDEX IF NOT EXISTS "BlankBookOrder_confirmTokenHash_key" ON "BlankBookOrder"("confirmTokenHash");
CREATE INDEX IF NOT EXISTS "BlankBookOrder_status_createdAt_idx" ON "BlankBookOrder"("status", "createdAt");
