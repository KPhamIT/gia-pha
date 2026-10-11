import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import DirectionTool from "@/components/phong-thuy/DirectionTool";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-huong-nha";

export const metadata: Metadata = createMetadata({
  title: UI.XH_TITLE,
  description: UI.XH_META_DESC,
  path: PATH,
  keywords: [
    "xem hướng nhà",
    "hướng nhà hợp tuổi",
    "cung mệnh bát trạch",
    "đông tứ mệnh tây tứ mệnh",
    "hướng sinh khí",
  ],
});

export default function DirectionPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.XH_TITLE}
      lead={UI.XH_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-huong-nha"
    >
      <SeoSchemas
        path={PATH}
        title={UI.XH_TITLE}
        description={UI.XH_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.XH_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <DirectionTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.XH_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.XH_GUIDE} faq={UI.XH_FAQ} />
      </div>
    </ToolPageShell>
  );
}
