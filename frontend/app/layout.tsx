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
  description: UI.PAGE_DESCRIPTION,
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
      <Script id="theme-init" strategy="beforeInteractive">
        {themeInitScript()}
      </Script>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
