const DEFAULT_SITE_URL = "https://www.coinguon.io.vn";

/** Canonical site URL for sitemap, OG, join-link placeholder, and absolute links. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/$/, "");
  }
  return `https://${raw.replace(/\/$/, "")}`;
}

/** Ví dụ định dạng liên kết tham gia dòng họ trên landing. */
export function getJoinLinkInputPlaceholder(
  sampleToken = "ma-lien-ket-tu-ban-quan-tri",
): string {
  return `${getSiteUrl()}/join/${sampleToken}`;
}
