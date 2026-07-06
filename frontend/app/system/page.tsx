import type { Metadata } from "next";
import SystemPageView from "@/components/system/SystemPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.SYSTEM_CONSOLE_TITLE,
  description: UI.SYSTEM_CONSOLE_SUBTITLE,
  path: "/system",
});

export default function SystemPage() {
  return <SystemPageView />;
}
