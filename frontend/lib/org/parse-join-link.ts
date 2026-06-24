/** Chuẩn hoá input (URL đầy đủ, path /join/…, hoặc token) → `/join/{token}`. */
export function parseOrgJoinLink(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const fromPath = extractJoinToken(trimmed);
  if (fromPath) return `/join/${encodeURIComponent(fromPath)}`;

  try {
    const url = new URL(
      trimmed.startsWith("//") ? `https:${trimmed}` : trimmed,
      "https://placeholder.local",
    );
    const fromUrl = extractJoinToken(url.pathname);
    if (fromUrl) return `/join/${encodeURIComponent(fromUrl)}`;
  } catch {
    /* not a URL — fall through */
  }

  if (!/\s/.test(trimmed)) {
    return `/join/${encodeURIComponent(trimmed)}`;
  }

  return null;
}

function extractJoinToken(path: string): string | null {
  const match = path.match(/\/join\/([^/?#]+)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
