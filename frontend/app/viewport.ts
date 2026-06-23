import type { Viewport } from "next";

/** Lock page zoom on iOS — graph/book have their own pinch-zoom; avoids stuck zoom after focusing inputs. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#78350f" },
    { media: "(prefers-color-scheme: dark)", color: "#451a03" },
  ],
};
