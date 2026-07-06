import type { MetadataRoute } from "next";
import { fetchBlogSlugs } from "@/lib/blog/server-api";
import { getSiteUrl } from "@/config/site";

/** Public marketing & content pages only — no auth/app routes. */
const STATIC_PAGES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/huong-dan", changeFrequency: "monthly", priority: 0.9 },
  { path: "/cai-dat", changeFrequency: "monthly", priority: 0.85 },
  { path: "/bai-viet", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gioi-thieu", changeFrequency: "monthly", priority: 0.8 },
  { path: "/dich-vu", changeFrequency: "monthly", priority: 0.8 },
  { path: "/lien-he", changeFrequency: "monthly", priority: 0.7 },
  { path: "/bang-gia", changeFrequency: "monthly", priority: 0.8 },
  { path: "/chinh-sach-bao-mat", changeFrequency: "yearly", priority: 0.4 },
  { path: "/dieu-khoan-su-dung", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const blogSlugs = (await fetchBlogSlugs()) ?? [];

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((entry) => ({
    url: `${base}/bai-viet/${entry.slug}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}
