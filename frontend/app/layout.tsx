import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Serif } from "next/font/google";
import "./globals.css";
import { UI } from "@/lib/constants/ui-strings";
import { getSiteUrl } from "@/lib/site-url";
import { themeInitScript } from "@/utils/theme";
import AppToaster from "@/components/ui/AppToaster";
import LandingScrollManager from "@/components/public/LandingScrollManager";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export { viewport } from "./viewport";

export const metadata: Metadata = {
  title: UI.PAGE_TITLE,
  description: UI.LANDING_HERO_SUBTITLE,
  applicationName: UI.PAGE_TITLE,
  metadataBase: new URL(getSiteUrl()),
  appleWebApp: {
    capable: true,
    title: UI.PAGE_TITLE,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: UI.LANDING_HERO_TITLE,
    description: UI.LANDING_HERO_SUBTITLE,
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript()}
        </Script>
        {children}
        <LandingScrollManager />
        <AppToaster />
      </body>
    </html>
  );
}
