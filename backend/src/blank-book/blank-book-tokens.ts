import { createHash, randomBytes, randomInt } from 'node:crypto';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Mã đơn ngắn để ghi vào nội dung chuyển khoản. */
export function generateBlankBookCode(): string {
  let suffix = '';
  for (let i = 0; i < 6; i += 1)
    suffix += CODE_CHARS[randomInt(CODE_CHARS.length)];
  return `SG${suffix}`;
}

/** Token ngẫu nhiên 256-bit, an toàn cho URL. */
export function generateSecretToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
