import type { Metadata } from "next";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import PublicProseContent from "@/components/public/PublicProseContent";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { ABOUT_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: ABOUT_DOCUMENT.title,
  description: ABOUT_DOCUMENT.subtitle,
  path: "/gioi-thieu",
  keywords: ["giới thiệu", "gia phả điện tử", "dòng họ"],
});

export default function AboutPage() {
  return (
    <PublicDocPageShell
      title={ABOUT_DOCUMENT.title}
      subtitle={ABOUT_DOCUMENT.subtitle}
    >
      <SeoSchemas
        path="/gioi-thieu"
        title={ABOUT_DOCUMENT.title}
        description={ABOUT_DOCUMENT.subtitle}
      />
      <PublicProseContent document={ABOUT_DOCUMENT} />
    </PublicDocPageShell>
  );
}
