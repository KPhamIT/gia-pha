import type { Metadata } from "next";
import OrgUsersPageView from "@/components/org/OrgUsersPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.ORG_USERS_TITLE,
  description: UI.ORG_USERS_SUBTITLE,
  path: "/org-users",
});

export default function OrgUsersPage() {
  return <OrgUsersPageView />;
}
