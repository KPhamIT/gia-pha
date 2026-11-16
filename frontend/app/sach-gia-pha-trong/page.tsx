import type { Metadata } from "next";
import BlankBookOrderForm from "@/components/blank-book/BlankBookOrderForm";
import { BLANK_BOOK_PATH } from "@/components/blank-book/blank-book-paths";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BLANK_BOOK_TITLE,
  description: UI.BLANK_BOOK_META_DESC,
  path: BLANK_BOOK_PATH,
  keywords: ["sổ gia phả trống", "mẫu sổ gia phả", "file sổ gia phả in sẵn", "sổ gia phả viết tay"],
});

export default function BlankBookPage() {
  return (
    <PublicDocPageShell title={UI.BLANK_BOOK_TITLE} subtitle={UI.BLANK_BOOK_SUBTITLE} backHref="/dich-vu">
      <BlankBookOrderForm />
    </PublicDocPageShell>
  );
}
