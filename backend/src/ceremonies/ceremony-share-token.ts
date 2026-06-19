import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_SIG_LENGTH = 16;

function signPersonId(personId: number, secret: string): string {
  return createHmac('sha256', secret)
    .update(`ceremony-share:${personId}`)
    .digest('base64url')
    .slice(0, TOKEN_SIG_LENGTH);
}

export function createCeremonyShareToken(personId: number, secret: string): string {
  return `${personId}.${signPersonId(personId, secret)}`;
}

export function verifyCeremonyShareToken(token: string, secret: string): number | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;

  const personId = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isInteger(personId) || personId <= 0 || sig.length !== TOKEN_SIG_LENGTH) {
    return null;
  }

  const expected = signPersonId(personId, secret);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  return personId;
}
