import Link from "next/link";
import PrivacyIcon from "@/components/public/privacy/PrivacyIcon";
import {
  PRIVACY_PAGE_CARDS,
  PRIVACY_PAGE_UI,
  privacyCardAccentStyle,
} from "@/lib/constants/ui-strings/privacy-page";

const cardClass =
  "flex h-full flex-col rounded-xl border border-[#795553]/10 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md";

export function PrivacyPageContent() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PRIVACY_PAGE_CARDS.map((card) => {
          const style = privacyCardAccentStyle(card.accent);
          return (
            <article
              key={card.title}
              className={`${cardClass} border-l-4 ${style.border}`}
            >
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`rounded-lg p-3 ${style.iconBg} ${style.iconColor}`}
                >
                  <PrivacyIcon name={card.icon} size={24} />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#321716]">
                  {card.title}
                </h2>
              </div>
              <div className="flex-grow space-y-4 text-base text-[#504443]">
                <p>{card.intro}</p>
                <ul className="list-disc space-y-2 pl-5">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
      <PrivacyContactCta />
    </>
  );
}

function PrivacyContactCta() {
  return (
    <section className="mt-16 rounded-2xl border border-[#d4c3c1] bg-[#f0ede9] p-8 text-center">
      <h2 className="mb-4 font-serif text-2xl font-semibold text-[#321716]">
        {PRIVACY_PAGE_UI.CTA_TITLE}
      </h2>
      <p className="mb-6 text-base text-[#504443]">{PRIVACY_PAGE_UI.CTA_BODY}</p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          href="/lien-he"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#321716] px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <PrivacyIcon name="mail" size={20} />
          {PRIVACY_PAGE_UI.CTA_SUPPORT}
        </Link>
        <Link
          href="/huong-dan"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#321716] px-8 py-3 text-sm font-semibold text-[#321716] transition-colors hover:bg-[#ebe8e3]"
        >
          <PrivacyIcon name="help" size={20} />
          {PRIVACY_PAGE_UI.CTA_HELP}
        </Link>
      </div>
    </section>
  );
}
