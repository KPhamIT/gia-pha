import Icon from "@/components/icons/Icon";
import PrivacyIcon from "@/components/public/privacy/PrivacyIcon";
import { PRIVACY_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { PRIVACY_PAGE_UI } from "@/lib/constants/ui-strings/privacy-page";
import { UI } from "@/lib/constants/ui-strings";

export default function PrivacyPageHero() {
  return (
    <section className="mb-16 text-center">
      <PrivacyIcon
        name="policy"
        size={48}
        className="mx-auto mb-4 text-[#944a00]"
      />
      <h1 className="mb-4 font-serif text-[28px] font-semibold leading-tight text-[#321716] md:text-[32px]">
        {PRIVACY_DOCUMENT.title}
      </h1>
      <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#504443]">
        {PRIVACY_PAGE_UI.HERO_INTRO}
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
        <span>{UI.PUBLIC_LAST_UPDATED(PRIVACY_DOCUMENT.lastUpdated)}</span>
      </div>
    </section>
  );
}
