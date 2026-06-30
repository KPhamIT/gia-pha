"use client";

import Link from "next/link";
import { formatVnd } from "@/components/family-tree/events/event-format";
import type { TierCatalogEntry } from "@/lib/constants/billing";
import { TIER_DOT_CLASS } from "@/lib/constants/billing";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type PricingTierCardProps = {
  tier: TierCatalogEntry;
  payHref?: string;
};

export default function PricingTierCard({ tier, payHref }: PricingTierCardProps) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-4 shadow-sm ${BT.card}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-3 w-3 shrink-0 rounded-full ${TIER_DOT_CLASS[tier.color]}`}
          aria-hidden
        />
        <h3 className="text-base font-semibold text-neutral-900">{tier.label}</h3>
      </div>
      <p className="mt-2 text-2xl font-bold text-amber-900">
        {formatVnd(tier.priceVnd)}
        <span className="text-sm font-normal text-neutral-500">
          {UI.PRICING_PER_YEAR}
        </span>
      </p>
      <ul className={`mt-3 space-y-1.5 text-sm ${BT.mutedOnLight}`}>
        <li>{UI.PRICING_MAX_PERSONS(tier.maxPersons)}</li>
        <li>{UI.PRICING_STORAGE(tier.storageQuotaGb)}</li>
        <li>{UI.PRICING_ADMINS(tier.maxAdmins)}</li>
      </ul>
      {payHref ? (
        <Link
          href={payHref}
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mt-4 w-full text-center`}
        >
          {UI.PRICING_CTA_PAY}
        </Link>
      ) : null}
    </div>
  );
}
