import type { Metadata } from "next";
import AccountPageView from "@/components/auth/AccountPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.ACCOUNT_PAGE_TITLE,
  description: UI.ACCOUNT_SUBTITLE,
  path: "/account",
});

export default function AccountPage() {
  return <AccountPageView />;
}
