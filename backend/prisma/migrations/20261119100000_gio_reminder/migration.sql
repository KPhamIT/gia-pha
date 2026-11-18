-- CreateTable
CREATE TABLE IF NOT EXISTS "GioReminder" (
    "id" SERIAL NOT NULL,
    "deceasedName" TEXT NOT NULL,
    "lunarMonth" INTEGER NOT NULL,
    "lunarDay" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "manageToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastSentKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GioReminder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GioReminder_manageToken_key" ON "GioReminder"("manageToken");
CREATE INDEX IF NOT EXISTS "GioReminder_active_lunarMonth_lunarDay_idx" ON "GioReminder"("active", "lunarMonth", "lunarDay");
CREATE INDEX IF NOT EXISTS "GioReminder_email_idx" ON "GioReminder"("email");
