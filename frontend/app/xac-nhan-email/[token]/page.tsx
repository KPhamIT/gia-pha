import type { Metadata } from "next";
import EmailVerifyView from "@/components/auth/email-verify/EmailVerifyView";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.VERIFY_PAGE_TITLE,
  description: UI.VERIFY_PAGE_SUBTITLE,
  path: "/xac-nhan-email",
  noIndex: true,
});

export default async function EmailVerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <PublicDocPageShell title={UI.VERIFY_PAGE_TITLE} subtitle={UI.VERIFY_PAGE_SUBTITLE} backHref="/">
      <EmailVerifyView token={token} />
    </PublicDocPageShell>
  );
}
