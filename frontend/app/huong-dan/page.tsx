import type { Metadata } from "next";
import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import GuideSectionBlock from "@/components/guide/GuideSectionBlock";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { GUIDE_SECTIONS } from "@/lib/constants/ui-strings/guide";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export const metadata: Metadata = {
  title: `${UI.GUIDE_PAGE_TITLE} | ${UI.PAGE_TITLE}`,
  description: UI.GUIDE_PAGE_SUBTITLE,
};

export default function UserGuidePage() {
  return (
    <BookPageShell
      title={UI.GUIDE_PAGE_TITLE}
      subtitle={UI.GUIDE_PAGE_SUBTITLE}
      backHref="/"
      hideNavFab
    >
      <div className="space-y-8 pb-8">
        <div className={`${BT.card} space-y-4 p-4 md:p-5`}>
          <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {UI.GUIDE_NOTE_VIEW_ONLY}
          </p>
          <Link
            href="/book"
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} inline-flex`}
          >
            {UI.GUIDE_CTA}
          </Link>
          <p className={`text-xs ${BT.mutedOnLight}`}>{UI.GUIDE_CTA_HINT}</p>
        </div>

        <nav className={`${BT.card} p-4 md:p-5`} aria-label={UI.GUIDE_TOC_TITLE}>
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">
            {UI.GUIDE_TOC_TITLE}
          </h2>
          <ol className="grid gap-2 sm:grid-cols-2">
            {GUIDE_SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-amber-900 transition hover:bg-amber-50"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-6">
          {GUIDE_SECTIONS.map((section) => (
            <GuideSectionBlock key={section.id} section={section} />
          ))}
        </div>

        <div className={`${BT.card} space-y-3 p-4 text-center md:p-5`}>
          <p className={`text-sm ${BT.mutedOnLight}`}>{UI.GUIDE_CTA_HINT}</p>
          <Link
            href="/book"
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} inline-flex`}
          >
            {UI.GUIDE_CTA}
          </Link>
        </div>

        <PublicSiteFooter />
      </div>
    </BookPageShell>
  );
}
