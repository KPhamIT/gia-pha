const DEFAULT_SITE_URL = "https://www.coinguon.io.vn";

function normalizeSiteUrl(raw: string): string {
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }
  return `https://${raw.replace(/\/$/, "")}`;
}

/** Canonical site URL for sitemap, OG, join-link placeholder, and absolute links. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalizeSiteUrl(explicit);

  // Preview deployments only — production must not use *.vercel.app in sitemap/OG.
  if (process.env.VERCEL_ENV === "preview") {
    const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
    if (vercel) return normalizeSiteUrl(vercel);
  }

  return DEFAULT_SITE_URL;
}

/** Ví dụ định dạng liên kết tham gia dòng họ trên landing. */
export function getJoinLinkInputPlaceholder(
  sampleToken = "ma-lien-ket-tu-ban-quan-tri",
): string {
  return buildJoinLinkUrl(sampleToken);
}

export function buildJoinLinkUrl(token: string): string {
  return `${getSiteUrl()}/join/${encodeURIComponent(token)}`;
}
