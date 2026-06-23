import type { MetadataRoute } from "next";
import { UI } from "@/lib/constants/ui-strings";

/** PWA manifest — mở từ màn hình chính sẽ ẩn thanh URL & thanh điều hướng trình duyệt. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: UI.LANDING_HERO_TITLE,
    short_name: UI.PAGE_TITLE,
    description: UI.LANDING_HERO_SUBTITLE,
    start_url: "/book",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen"],
    orientation: "portrait-primary",
    background_color: "#451a03",
    theme_color: "#78350f",
    lang: "vi",
    icons: [
      {
        src: "/icons/pwa-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
