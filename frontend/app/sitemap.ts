import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const PUBLIC_PATHS = [
  "",
  "/huong-dan",
  "/gioi-thieu",
  "/lien-he",
  "/chinh-sach-bao-mat",
  "/dieu-khoan-su-dung",
  "/join",
  "/login",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return PUBLIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/huong-dan" ? 0.9 : 0.7,
  }));
}
