import type { Metadata } from "next";
import NotificationCenterPageView from "@/components/notifications/NotificationCenterPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.NOTIFICATIONS_TITLE,
  description: UI.NOTIFICATIONS_SUBTITLE,
  path: "/notifications",
});

export default function NotificationsPage() {
  return <NotificationCenterPageView />;
}
