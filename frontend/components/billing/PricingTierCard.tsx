"use client";

import Link from "next/link";
import { AC } from "@/components/auth/account-theme";
import { formatVnd } from "@/components/family-tree/events/event-format";
import type { TierCatalogEntry, TierColor } from "@/lib/constants/billing";
import { TIER_DOT_CLASS } from "@/lib/constants/billing";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

const TIER_LANDING_ACCENT: Record<TierColor, string> = {
  green: "border-l-emerald-600",
  blue: "border-l-sky-600",
  orange: "border-l-[#944a00]",
  red: "border-l-rose-700",
};

type PricingTierCardProps = {
  tier: TierCatalogEntry;
  payHref?: string;
  variant?: "book" | "landing";
};

export default function PricingTierCard({
  tier,
  payHref,
  variant = "book",
}: PricingTierCardProps) {
  const isLanding = variant === "landing";
  const cardClass = isLanding
    ? `${AC.card} border-l-4 ${TIER_LANDING_ACCENT[tier.color]}`
    : `flex flex-col rounded-xl border p-4 shadow-sm ${BT.card}`;
  const titleClass = isLanding
    ? "text-base font-semibold text-[#321716]"
    : "text-base font-semibold text-neutral-900";
  const priceClass = isLanding
    ? "text-2xl font-bold text-[#944a00]"
    : "text-2xl font-bold text-amber-900";
  const mutedClass = isLanding ? AC.muted : BT.mutedOnLight;
  const payBtnClass = isLanding
    ? "mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#321716] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] active:scale-95"
    : `${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mt-4 w-full text-center`;

  return (
    <div className={`flex flex-col p-4 md:p-6 ${cardClass}`}>
      <div className="flex items-center gap-2">
        <span
          className={`h-3 w-3 shrink-0 rounded-full ${TIER_DOT_CLASS[tier.color]}`}
          aria-hidden
        />
        <h3 className={titleClass}>{tier.label}</h3>
      </div>
      <p className={`mt-2 ${priceClass}`}>
        {formatVnd(tier.priceVnd)}
        <span className={`text-sm font-normal ${isLanding ? "text-[#827472]" : "text-neutral-500"}`}>
          {UI.PRICING_PER_YEAR}
        </span>
      </p>
      <ul className={`mt-3 flex-1 space-y-1.5 text-sm ${mutedClass}`}>
        <li>{UI.PRICING_MAX_PERSONS(tier.maxPersons)}</li>
        <li>{UI.PRICING_STORAGE(tier.storageQuotaGb)}</li>
        <li>{UI.PRICING_ADMINS(tier.maxAdmins)}</li>
      </ul>
      {payHref ? (
        <Link href={payHref} className={payBtnClass}>
          {UI.PRICING_CTA_PAY}
        </Link>
      ) : null}
    </div>
  );
}
