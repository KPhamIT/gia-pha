import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Serif } from "next/font/google";
import "./globals.css";
import { UI } from "@/lib/constants/ui-strings";
import { themeInitScript } from "@/utils/theme";
import AppToaster from "@/components/ui/AppToaster";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: UI.PAGE_TITLE,
  description: UI.LANDING_HERO_SUBTITLE,
  applicationName: UI.PAGE_TITLE,
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
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
        <AppToaster />
      </body>
    </html>
  );
}
