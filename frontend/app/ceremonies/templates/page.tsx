import CeremonyTemplatesPageView from "@/components/ceremonies/CeremonyTemplatesPageView";
import type { Metadata } from "next";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.CEREMONY_TEMPLATES_TITLE,
  description: UI.CEREMONY_TEMPLATES_PAGE_DESC,
  path: "/ceremonies/templates",
  keywords: ["mẫu bài cúng", "bài cúng", "ngày giỗ", "gia phả"],
});

export default function CeremonyTemplatesPage() {
  return <CeremonyTemplatesPageView />;
}
