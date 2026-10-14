import type { MetadataRoute } from "next";
import { fetchBlogSlugs } from "@/lib/blog/server-api";
import { BLOG_MERGED_SLUGS } from "@/lib/blog/redirects";
import { fetchPublicCeremonies } from "@/lib/van-khan/server-api";
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
  { path: "/van-khan", changeFrequency: "monthly", priority: 0.85 },
  { path: "/cong-cu", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/xung-ho", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/xem-huong-nha", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/xem-tuoi-lam-nha", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/xem-ngay-gio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/cong-cu/xem-ngay-cuoi", changeFrequency: "weekly", priority: 0.8 },
  { path: "/cong-cu/xem-vi-tri-phong", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/xem-mau-son-nha", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/xem-tuoi-sinh-con", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cong-cu/dat-ten-con", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tao-dong-ho", changeFrequency: "monthly", priority: 0.85 },
  { path: "/gioi-thieu", changeFrequency: "monthly", priority: 0.8 },
  { path: "/dich-vu", changeFrequency: "monthly", priority: 0.85 },
  { path: "/lien-he", changeFrequency: "monthly", priority: 0.7 },
  { path: "/bang-gia", changeFrequency: "monthly", priority: 0.8 },
  { path: "/chinh-sach-bao-mat", changeFrequency: "yearly", priority: 0.4 },
  { path: "/dieu-khoan-su-dung", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  // Fresh slugs for sitemap (keyword posts + updates); list pages keep longer ISR.
  const [blogSlugs, ceremonies] = await Promise.all([
    fetchBlogSlugs({ revalidate: 300 }).then((items) => items ?? []),
    fetchPublicCeremonies(3600).then((items) => items ?? []),
  ]);

  // Không gán lastModified = thời điểm build: Google bỏ qua lastmod nếu luôn thay đổi giả.
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${base}${path}`,
      changeFrequency,
      priority,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = blogSlugs
    .filter((entry) => !(entry.slug in BLOG_MERGED_SLUGS))
    .map((entry) => ({
      url: `${base}/bai-viet/${entry.slug}`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const ceremonyEntries: MetadataRoute.Sitemap = ceremonies.map((item) => ({
    url: `${base}/van-khan/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: "yearly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...blogEntries, ...ceremonyEntries];
}
