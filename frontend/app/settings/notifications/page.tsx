import type { Metadata } from "next";
import NotificationSettingsPageView from "@/components/notifications/NotificationSettingsPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.NOTIFICATIONS_SETTINGS_TITLE,
  description: UI.NOTIFICATIONS_SETTINGS_SUBTITLE,
  path: "/settings/notifications",
});

export default function NotificationSettingsPage() {
  return <NotificationSettingsPageView />;
}
