import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_SIG_LENGTH = 16;

function signOrgId(orgId: number, secret: string): string {
  return createHmac('sha256', secret)
    .update(`org-access:${orgId}`)
    .digest('base64url')
    .slice(0, TOKEN_SIG_LENGTH);
}

export function createOrgAccessToken(orgId: number, secret: string): string {
  return `${orgId}.${signOrgId(orgId, secret)}`;
}

export function verifyOrgAccessToken(
  token: string,
  secret: string,
): number | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;

  const orgId = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isInteger(orgId) || orgId <= 0 || sig.length !== TOKEN_SIG_LENGTH) {
    return null;
  }

  const expected = signOrgId(orgId, secret);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  return orgId;
}
