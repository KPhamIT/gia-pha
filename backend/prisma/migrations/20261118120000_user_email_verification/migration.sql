-- Xác nhận email khi đăng ký (idempotent — áp thủ công lên prod trước khi push)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifyTokenHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifyExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifySentAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "User_emailVerifyTokenHash_key" ON "User"("emailVerifyTokenHash");
