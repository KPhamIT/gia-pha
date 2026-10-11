import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import NameTool from "@/components/dat-ten/NameTool";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/dat-ten-con";

export const metadata: Metadata = createMetadata({
  title: UI.DT_TITLE,
  description: UI.DT_META_DESC,
  path: PATH,
  keywords: [
    "đặt tên con",
    "đặt tên con hợp mệnh",
    "đặt tên theo thần số học",
    "tên hợp tuổi bố mẹ",
    "gợi ý tên cho bé",
  ],
});

export default function NamePage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.DT_TITLE}
      lead={UI.DT_LEAD}
      breadcrumbs={breadcrumbs}
      active="dat-ten-con"
    >
      <SeoSchemas
        path={PATH}
        title={UI.DT_TITLE}
        description={UI.DT_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.DT_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <NameTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.DT_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.DT_GUIDE} faq={UI.DT_FAQ} />
      </div>
    </ToolPageShell>
  );
}
