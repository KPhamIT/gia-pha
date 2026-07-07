import Link from "next/link";
import { AC } from "@/components/auth/account-theme";
import PricingTierCard from "@/components/billing/PricingTierCard";
import { TIER_CATALOG } from "@/lib/constants/billing";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  payQuery: string;
};

export default function PricingPageContent({ payQuery }: Props) {
  return (
    <div className="mx-auto max-w-[1280px] space-y-8 pb-8">
      <p className={`text-base leading-relaxed ${AC.muted}`}>{UI.PRICING_INTRO}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {TIER_CATALOG.map((tier) => (
          <PricingTierCard
            key={tier.tier}
            tier={tier}
            variant="landing"
            payHref={payQuery ? `/bang-gia/thanh-toan${payQuery}` : undefined}
          />
        ))}
      </div>

      <section className={`${AC.cardPaper} p-6 md:p-8`}>
        <h2 className={AC.sectionTitle}>{UI.PRICING_FAQ_TITLE}</h2>
        <ul className={`mt-4 list-disc space-y-2 pl-5 text-sm ${AC.muted}`}>
          {UI.PRICING_FAQ_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        {payQuery ? (
          <Link
            href={`/bang-gia/thanh-toan${payQuery}`}
            className="inline-flex rounded-xl bg-[#321716] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] active:scale-95"
          >
            {UI.PRICING_CTA_PAY}
          </Link>
        ) : null}
        <Link
          href="/lien-he"
          className="inline-flex rounded-xl border border-[#321716] px-6 py-3 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee] active:scale-95"
        >
          {UI.PRICING_CTA_CONTACT}
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-xl border border-[#d4c3c1] px-6 py-3 text-sm font-semibold text-[#504443] transition hover:bg-[#f6f3ee] active:scale-95"
        >
          {UI.PRICING_BACK}
        </Link>
      </div>
    </div>
  );
}
