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
      ],
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
