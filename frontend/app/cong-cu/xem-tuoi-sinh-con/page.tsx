import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ChildAgeTool from "@/components/sinh-con/ChildAgeTool";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-tuoi-sinh-con";

export const metadata: Metadata = createMetadata({
  title: UI.SC_TITLE,
  description: UI.SC_META_DESC,
  path: PATH,
  keywords: [
    "xem tuổi sinh con",
    "năm sinh con hợp tuổi bố mẹ",
    "sinh con năm nào đẹp",
    "tuổi con hợp bố mẹ",
  ],
});

export default function ChildAgePage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.SC_TITLE}
      lead={UI.SC_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-tuoi-sinh-con"
    >
      <SeoSchemas
        path={PATH}
        title={UI.SC_TITLE}
        description={UI.SC_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.SC_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <ChildAgeTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.SC_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.SC_GUIDE} faq={UI.SC_FAQ} />
      </div>
    </ToolPageShell>
  );
}
