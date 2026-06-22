/** Canonical site URL for sitemap, OG, and absolute links. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (!raw) return "http://localhost:3000";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw.replace(/\/$/, "");
  return `https://${raw.replace(/\/$/, "")}`;
}
