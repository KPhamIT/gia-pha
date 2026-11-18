import type { Metadata } from "next";
import GioReminderManageView from "@/components/gio-reminder/GioReminderManageView";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.GR_MANAGE_TITLE,
  description: UI.GR_MANAGE_LEAD,
  path: "/nhac-ngay-gio/quan-ly",
  noIndex: true,
});

export default async function GioReminderManagePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <PublicDocPageShell title={UI.GR_MANAGE_TITLE} subtitle={UI.GR_MANAGE_LEAD} backHref="/nhac-ngay-gio">
      <GioReminderManageView token={token} />
    </PublicDocPageShell>
  );
}
