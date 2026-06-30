"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentCheckoutView from "@/components/billing/PaymentCheckoutView";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

function PaymentPageBody() {
  const searchParams = useSearchParams();
  const orgIdRaw = searchParams.get("orgId");
  const organizationId = orgIdRaw ? Number.parseInt(orgIdRaw, 10) : NaN;

  if (!Number.isFinite(organizationId)) {
    return (
      <p className={`text-sm ${BT.mutedOnLight}`}>{UI.PAYMENT_ORG_REQUIRED}</p>
    );
  }

  return <PaymentCheckoutView organizationId={organizationId} />;
}

export default function PaymentPage() {
  return (
    <PublicDocPageShell
      title={UI.PAYMENT_PAGE_TITLE}
      subtitle={UI.PAYMENT_PAGE_SUBTITLE}
      backHref="/bang-gia"
    >
      <Suspense
        fallback={<p className={`text-sm ${BT.mutedOnLight}`}>{UI.LOADING}</p>}
      >
        <PaymentPageBody />
      </Suspense>
    </PublicDocPageShell>
  );
}
