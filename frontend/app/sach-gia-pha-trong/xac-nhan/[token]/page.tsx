import type { Metadata } from "next";
import BlankBookConfirmView from "@/components/blank-book/BlankBookConfirmView";
import { BLANK_BOOK_PATH } from "@/components/blank-book/blank-book-paths";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BLANK_BOOK_CONFIRM_TITLE,
  description: UI.BLANK_BOOK_CONFIRM_SUBTITLE,
  path: `${BLANK_BOOK_PATH}/xac-nhan`,
  noIndex: true,
});

export default async function BlankBookConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <PublicDocPageShell title={UI.BLANK_BOOK_CONFIRM_TITLE} subtitle={UI.BLANK_BOOK_CONFIRM_SUBTITLE} backHref="/">
      <BlankBookConfirmView token={token} />
    </PublicDocPageShell>
  );
}
