"use client";

import SystemSubpageShell from "@/components/system/SystemSubpageShell";
import BillingOrdersSection from "@/components/system/BillingOrdersSection";
import { UI } from "@/lib/constants/ui-strings";

export default function SystemBillingPageView() {
  return (
    <SystemSubpageShell
      layoutTitle={UI.BILLING_ADMIN_OPEN}
      title={UI.BILLING_ADMIN_TITLE}
      subtitle={UI.BILLING_ADMIN_SUBTITLE}
    >
      <BillingOrdersSection variant="landing" />
    </SystemSubpageShell>
  );
}
