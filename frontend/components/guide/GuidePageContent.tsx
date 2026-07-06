import Link from "next/link";
import { AC } from "@/components/auth/account-theme";
import GuideSectionBlock from "@/components/guide/GuideSectionBlock";
import { GUIDE_SECTIONS } from "@/lib/constants/ui-strings/guide";
import { UI } from "@/lib/constants/ui-strings";

export default function GuidePageContent() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-8 pb-8">
      <div className={`${AC.card} space-y-4 p-4 md:p-6`}>
        <p className="text-sm leading-relaxed text-[#504443]">
          {UI.GUIDE_NOTE_VIEW_ONLY}
        </p>
        <Link
          href="/book"
          className="inline-flex rounded-xl bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] active:scale-95"
        >
          {UI.GUIDE_CTA}
        </Link>
        <p className="text-xs text-[#827472]">{UI.GUIDE_CTA_HINT}</p>
      </div>

      <nav
        className={`${AC.card} p-4 md:p-6`}
        aria-label={UI.GUIDE_TOC_TITLE}
      >
        <h2 className="mb-3 font-serif text-lg font-semibold text-[#321716]">
          {UI.GUIDE_TOC_TITLE}
        </h2>
        <ol className="grid gap-2 sm:grid-cols-2">
          {GUIDE_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block rounded-xl px-3 py-2 text-sm text-[#944a00] transition hover:bg-[#f6f3ee]"
              >
                {index + 1}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-6">
        {GUIDE_SECTIONS.map((section) => (
          <GuideSectionBlock
            key={section.id}
            section={section}
            variant="landing"
          />
        ))}
      </div>

      <div className={`${AC.cardPaper} space-y-3 p-6 text-center md:p-8`}>
        <p className="text-sm text-[#504443]">{UI.GUIDE_CTA_HINT}</p>
        <Link
          href="/book"
          className="inline-flex rounded-xl bg-[#321716] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] active:scale-95"
        >
          {UI.GUIDE_CTA}
        </Link>
      </div>
    </div>
  );
}
