import type { Metadata } from "next";
import BlankBookOrderView from "@/components/blank-book/BlankBookOrderView";
import { BLANK_BOOK_PATH } from "@/components/blank-book/blank-book-paths";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BLANK_BOOK_ORDER_TITLE,
  description: UI.BLANK_BOOK_ORDER_SUBTITLE,
  path: `${BLANK_BOOK_PATH}/don`,
  noIndex: true,
});

export default async function BlankBookOrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <PublicDocPageShell title={UI.BLANK_BOOK_ORDER_TITLE} subtitle={UI.BLANK_BOOK_ORDER_SUBTITLE} backHref={BLANK_BOOK_PATH}>
      <BlankBookOrderView accessToken={token} />
    </PublicDocPageShell>
  );
}
