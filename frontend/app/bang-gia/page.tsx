import type { Metadata } from "next";
import Link from "next/link";
import PricingTierCard from "@/components/billing/PricingTierCard";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { TIER_CATALOG } from "@/lib/constants/billing";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export const metadata: Metadata = {
  title: `${UI.PRICING_PAGE_TITLE} | ${UI.PAGE_TITLE}`,
  description: UI.PRICING_PAGE_SUBTITLE,
};

type PageProps = {
  searchParams: Promise<{ orgId?: string }>;
};

export default async function PricingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orgId = params.orgId ? Number.parseInt(params.orgId, 10) : null;
  const payQuery = orgId != null && !Number.isNaN(orgId) ? `?orgId=${orgId}` : "";

  return (
    <PublicDocPageShell
      title={UI.PRICING_PAGE_TITLE}
      subtitle={UI.PRICING_PAGE_SUBTITLE}
    >
      <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
        {UI.PRICING_INTRO}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TIER_CATALOG.map((tier) => (
          <PricingTierCard
            key={tier.tier}
            tier={tier}
            payHref={`/bang-gia/thanh-toan${payQuery}`}
          />
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800">
          {UI.PRICING_FAQ_TITLE}
        </h2>
        <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm ${BT.mutedOnLight}`}>
          {UI.PRICING_FAQ_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        {payQuery ? (
          <Link
            href={`/bang-gia/thanh-toan${payQuery}`}
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
          >
            {UI.PRICING_CTA_PAY}
          </Link>
        ) : null}
        <Link href="/" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}>
          {UI.PRICING_BACK}
        </Link>
      </div>
    </PublicDocPageShell>
  );
}
