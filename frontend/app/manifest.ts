import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** PWA manifest — mở từ màn hình chính sẽ ẩn thanh URL & thanh điều hướng trình duyệt. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.siteName,
    short_name: SITE.brandName,
    description: SITE.description,
    start_url: "/book",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen"],
    orientation: "portrait-primary",
    background_color: "#451a03",
    theme_color: "#78350f",
    lang: SITE.language,
    icons: [
      {
        src: SITE.logoPath,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SITE.logoPath,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
