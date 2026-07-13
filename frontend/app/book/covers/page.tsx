import type { Metadata } from "next";
import CoverStudioPageView from "@/components/cover-studio/CoverStudioPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.COVER_STUDIO_TITLE,
  description: UI.COVER_STUDIO_PAGE_DESC,
  path: "/book/covers",
  keywords: ["bìa gia phả", "thiết kế bìa", "in sách", "bleed"],
});

export default function BookCoversPage() {
  return <CoverStudioPageView />;
}
