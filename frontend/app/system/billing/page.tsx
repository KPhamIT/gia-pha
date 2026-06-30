"use client";

import BookPageShell from "@/components/ui/BookPageShell";
import BillingOrdersSection from "@/components/system/BillingOrdersSection";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

export default function SystemBillingPage() {
  const { ready } = useSystemAccess();

  if (!ready) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}
      >
        {UI.LOADING}
      </div>
    );
  }

  return (
    <BookPageShell
      title={UI.BILLING_ADMIN_TITLE}
      subtitle={UI.BILLING_ADMIN_SUBTITLE}
      backHref="/system"
    >
      <BillingOrdersSection />
    </BookPageShell>
  );
}
