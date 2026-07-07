import Link from "next/link";
import TermsIcon from "@/components/public/terms/TermsIcon";
import { TERMS_PAGE_UI } from "@/lib/constants/ui-strings/terms-page";
import { UI } from "@/lib/constants/ui-strings";

function TermsGeneralSection() {
  return (
    <div className="rounded-2xl border border-[#d4c3c1]/30 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-xl bg-[#ffdcc5] p-3 text-[#663100]">
          <TermsIcon name="gavel" size={24} />
        </div>
        <div>
          <h2 className="mb-2 font-serif text-2xl font-semibold text-[#321716]">
            {TERMS_PAGE_UI.GENERAL_TITLE}
          </h2>
          <p className="text-base text-[#504443]">
            {TERMS_PAGE_UI.GENERAL_SUBTITLE}
          </p>
        </div>
      </div>
      <div className="space-y-4 text-base leading-relaxed text-[#1c1c19]">
        {TERMS_PAGE_UI.GENERAL_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function TermsRightsSection() {
  return (
    <div className="rounded-2xl border border-[#d4c3c1]/30 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <TermsIcon name="verified" size={24} className="text-[#E67E22]" />
        <h2 className="font-serif text-2xl font-semibold text-[#321716]">
          {TERMS_PAGE_UI.RIGHTS_TITLE}
        </h2>
      </div>
      <ul className="space-y-4 text-base text-[#1c1c19]">
        {TERMS_PAGE_UI.RIGHTS_BULLETS.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="font-bold text-[#944a00]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TermsPrivacySection() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#4a2c2a] p-8 text-white shadow-xl">
      <div className="absolute -right-8 -top-8 text-[#bd928f] opacity-10 transition-transform duration-500 group-hover:rotate-12">
        <TermsIcon name="security" size={160} />
      </div>
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <TermsIcon name="shield" size={24} className="text-[#ffb783]" />
          <h2 className="font-serif text-2xl font-semibold text-[#FAF7F2]">
            {TERMS_PAGE_UI.PRIVACY_TITLE}
          </h2>
        </div>
        <p className="mb-4 text-base leading-relaxed text-[#eabcb8]/90">
          {TERMS_PAGE_UI.PRIVACY_BODY}{" "}
          <Link
            href="/chinh-sach-bao-mat"
            className="font-semibold text-[#ffb783] underline-offset-2 hover:underline"
          >
            {UI.PUBLIC_FOOTER_PRIVACY}
          </Link>
          .
        </p>
        <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
          <p className="text-sm font-semibold italic text-[#FAF7F2]">
            &ldquo;{TERMS_PAGE_UI.PRIVACY_QUOTE}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function TermsDisputeSection() {
  return (
    <div className="rounded-2xl border border-[#d4c3c1]/30 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="mb-4 flex items-center gap-3 font-serif text-2xl font-semibold text-[#321716]">
            <TermsIcon name="balance" size={24} className="text-[#944a00]" />
            {TERMS_PAGE_UI.DISPUTE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-[#1c1c19]">
            {TERMS_PAGE_UI.DISPUTE_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="h-48 w-full overflow-hidden rounded-xl bg-[#f0ede9] md:w-64">
          <img
            src="/images/about/story-main.webp"
            alt={TERMS_PAGE_UI.DISPUTE_IMAGE_ALT}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function TermsContactCta() {
  return (
    <div className="rounded-2xl border border-[#ffdcc5] bg-[#FEF3C7]/30 p-6 text-center">
      <p className="mb-2 text-sm font-semibold text-[#713700]">
        {TERMS_PAGE_UI.CTA_TEXT}
      </p>
      <Link
        href="/lien-he"
        className="inline-flex rounded-full bg-[#944a00] px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg active:scale-95"
      >
        {TERMS_PAGE_UI.CTA_BUTTON}
      </Link>
    </div>
  );
}

export function TermsPageContent() {
  return (
    <div className="space-y-8">
      <TermsGeneralSection />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <TermsRightsSection />
        <TermsPrivacySection />
      </div>
      <TermsDisputeSection />
      <TermsContactCta />
    </div>
  );
}
