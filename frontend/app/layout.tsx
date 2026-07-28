import type { Metadata } from "next";
import Script from "next/script";
import { Be_Vietnam_Pro, Noto_Serif, Playfair_Display } from "next/font/google";
import "./globals.css";
import { createRootMetadata } from "@/lib/seo";
import { themeInitScript } from "@/utils/theme";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import AppToaster from "@/components/ui/AppToaster";
import GlobalMobileChrome from "@/components/navigation/GlobalMobileChrome";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Thân trang sổ / in A4 — serif chuẩn Unicode tiếng Việt. */
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export { viewport } from "./viewport";

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${playfairDisplay.variable} ${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript()}
        </Script>
        {children}
        <GlobalMobileChrome />
        <AppToaster />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
