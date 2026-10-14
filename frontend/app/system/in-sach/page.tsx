import type { Metadata } from "next";
import SystemPrintBooksPageView from "@/components/system/print-books/SystemPrintBooksPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.PRINT_BOOKS_TITLE,
  description: UI.PRINT_BOOKS_SUBTITLE,
  path: "/system/in-sach",
});

export default function SystemPrintBooksPage() {
  return <SystemPrintBooksPageView />;
}
