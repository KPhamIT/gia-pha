import type { Metadata } from "next";
import EventsPageView from "@/components/family-tree/events/EventsPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.EVENTS_PAGE_TITLE,
  description: UI.EVENTS_SUBTITLE,
  path: "/events",
});

export default function EventsPage() {
  return <EventsPageView />;
}
