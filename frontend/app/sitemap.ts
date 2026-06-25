import type { MetadataRoute } from "next";
import { fetchBlogSlugs } from "@/lib/blog/server-api";
import { getSiteUrl } from "@/lib/site-url";

const PUBLIC_PATHS = [
  "",
  "/huong-dan",
  "/bai-viet",
  "/gioi-thieu",
  "/lien-he",
  "/chinh-sach-bao-mat",
  "/dieu-khoan-su-dung",
  "/join",
  "/login",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const blogSlugs = (await fetchBlogSlugs()) ?? [];

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/bai-viet" ? 0.9 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((entry) => ({
    url: `${base}/bai-viet/${entry.slug}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}
