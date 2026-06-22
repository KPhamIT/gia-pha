import type { Metadata } from "next";
import Link from "next/link";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import PublicProseContent from "@/components/public/PublicProseContent";
import { PRIVACY_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export const metadata: Metadata = {
  title: `${PRIVACY_DOCUMENT.title} | ${UI.PAGE_TITLE}`,
  description: PRIVACY_DOCUMENT.subtitle,
};

export default function PrivacyPage() {
  return (
    <PublicDocPageShell
      title={PRIVACY_DOCUMENT.title}
      subtitle={PRIVACY_DOCUMENT.subtitle}
    >
      <PublicProseContent document={PRIVACY_DOCUMENT} />
      <p className={`mt-6 text-sm ${BT.mutedOnLight}`}>
        <Link href="/lien-he" className="font-medium text-amber-800 underline-offset-2 hover:underline">
          {UI.PUBLIC_FOOTER_CONTACT}
        </Link>
      </p>
    </PublicDocPageShell>
  );
}
