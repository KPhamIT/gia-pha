import type { Metadata } from "next";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import PublicProseContent from "@/components/public/PublicProseContent";
import { ABOUT_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { UI } from "@/lib/constants/ui-strings";

export const metadata: Metadata = {
  title: `${ABOUT_DOCUMENT.title} | ${UI.PAGE_TITLE}`,
  description: ABOUT_DOCUMENT.subtitle,
};

export default function AboutPage() {
  return (
    <PublicDocPageShell
      title={ABOUT_DOCUMENT.title}
      subtitle={ABOUT_DOCUMENT.subtitle}
    >
      <PublicProseContent document={ABOUT_DOCUMENT} />
    </PublicDocPageShell>
  );
}
