"use client";

import Link from "next/link";
import BottomSheet from "@/components/ui/BottomSheet";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import type { ExportEligibility } from "@/lib/api/modules/billing";

type ExportPaywallSheetProps = {
  nodeCount: number;
  organizationId: number;
  eligibility: Extract<ExportEligibility, { allowed: false }>;
  onClose: () => void;
};

function paywallMessage(
  eligibility: ExportPaywallSheetProps["eligibility"],
  nodeCount: number,
): string {
  switch (eligibility.reason) {
    case "TIER_TOO_LOW":
      return UI.PAYWALL_UPGRADE;
    case "EXPIRED":
      return UI.PAYWALL_EXPIRED;
    case "DEMO":
      return UI.PAYWALL_DEMO;
    case "ENTERPRISE_REQUIRED":
      return UI.PAYWALL_ENTERPRISE;
    default:
      return UI.PAYWALL_BODY(nodeCount);
  }
}

export default function ExportPaywallSheet({
  nodeCount,
  organizationId,
  eligibility,
  onClose,
}: ExportPaywallSheetProps) {
  const pricingHref =
    eligibility.reason === "ENTERPRISE_REQUIRED"
      ? "/lien-he"
      : `/bang-gia?orgId=${organizationId}`;

  const ctaLabel =
    eligibility.reason === "ENTERPRISE_REQUIRED"
      ? UI.PRICING_CTA_CONTACT
      : UI.PAYWALL_VIEW_PRICING;

  return (
    <BottomSheet onClose={onClose} maxWidth="md" zClass="z-[70]">
      <div className={`${LAYOUT.pagePad} space-y-4 pb-6`}>
        <h2 className="text-lg font-semibold text-neutral-900">
          {UI.PAYWALL_TITLE}
        </h2>
        <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
          {paywallMessage(eligibility, nodeCount)}
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={pricingHref}
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} w-full text-center`}
            onClick={onClose}
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} w-full`}
          >
            {UI.PAYWALL_CLOSE}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
