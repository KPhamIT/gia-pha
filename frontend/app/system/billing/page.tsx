import type { Metadata } from "next";
import SystemBillingPageView from "@/components/system/SystemBillingPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BILLING_ADMIN_TITLE,
  description: UI.BILLING_ADMIN_SUBTITLE,
  path: "/system/billing",
});

export default function SystemBillingPage() {
  return <SystemBillingPageView />;
}
