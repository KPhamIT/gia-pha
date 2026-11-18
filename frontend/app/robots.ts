import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/system",
        "/system/",
        "/org-users",
        "/api/",
        "/auth/callback",
        "/login",
        "/join/",
        "/book",
        "/family-tree",
        "/account",
        "/ceremonies/",
        "/nhac-ngay-gio/quan-ly/",
        "/sach-gia-pha-trong/don/",
        "/sach-gia-pha-trong/xac-nhan/",
      ],
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
