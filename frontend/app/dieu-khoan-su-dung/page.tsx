import type { Metadata } from "next";
import Link from "next/link";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import PublicProseContent from "@/components/public/PublicProseContent";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { TERMS_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: TERMS_DOCUMENT.title,
  description: TERMS_DOCUMENT.subtitle,
  path: "/dieu-khoan-su-dung",
});

export default function TermsPage() {
  return (
    <PublicDocPageShell
      title={TERMS_DOCUMENT.title}
      subtitle={TERMS_DOCUMENT.subtitle}
    >
      <SeoSchemas
        path="/dieu-khoan-su-dung"
        title={TERMS_DOCUMENT.title}
        description={TERMS_DOCUMENT.subtitle}
      />
      <PublicProseContent document={TERMS_DOCUMENT} />
      <p className={`mt-6 text-sm ${BT.mutedOnLight}`}>
        <Link href="/chinh-sach-bao-mat" className="font-medium text-amber-800 underline-offset-2 hover:underline">
          {UI.PUBLIC_FOOTER_PRIVACY}
        </Link>
      </p>
    </PublicDocPageShell>
  );
}
