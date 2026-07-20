import type { Metadata } from "next";
import NotesPageView from "@/components/notes/NotesPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.NOTES_PAGE_TITLE,
  description: UI.NOTES_PAGE_SUBTITLE,
  path: "/notes",
});

export default function NotesPage() {
  return <NotesPageView />;
}
