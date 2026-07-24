import type { Metadata } from "next";
import ClanDutyPageView from "@/components/clan-duty/ClanDutyPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.CLAN_DUTY_PAGE_TITLE,
  description: UI.CLAN_DUTY_PAGE_SUBTITLE,
  path: "/events/bien-ho",
});

export default function ClanDutyPage() {
  return <ClanDutyPageView />;
}
