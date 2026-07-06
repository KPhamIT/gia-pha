import Icon from "@/components/icons/Icon";
import { TERMS_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { TERMS_PAGE_UI } from "@/lib/constants/ui-strings/terms-page";
import { UI } from "@/lib/constants/ui-strings";

export default function TermsPageHero() {
  return (
    <section className="mb-12 text-center">
      <h1 className="mb-4 font-serif text-[28px] font-semibold leading-tight text-[#321716] md:text-[32px]">
        {TERMS_DOCUMENT.title}
      </h1>
      <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#504443]">
        {TERMS_PAGE_UI.HERO_INTRO}
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#827472]">
        <Icon
          path="calendar"
          size={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
          className="text-[#827472]"
        />
        <span>{UI.PUBLIC_LAST_UPDATED(TERMS_DOCUMENT.lastUpdated)}</span>
      </div>
    </section>
  );
}
