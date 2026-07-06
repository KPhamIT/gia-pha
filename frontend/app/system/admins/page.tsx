import type { Metadata } from "next";
import SystemAdminsPageView from "@/components/system/SystemAdminsPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.SYSTEM_ADMINS_TITLE,
  description: UI.SYSTEM_ADMINS_SUBTITLE,
  path: "/system/admins",
});

export default function SystemAdminsPage() {
  return <SystemAdminsPageView />;
}
