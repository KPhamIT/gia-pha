import type { Metadata } from "next";
import ColorTool from "@/components/mau-son/ColorTool";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-mau-son-nha";

export const metadata: Metadata = createMetadata({
  title: UI.MS_TITLE,
  description: UI.MS_META_DESC,
  path: PATH,
  keywords: [
    "màu sơn nhà hợp mệnh",
    "chọn màu sơn theo tuổi",
    "màu gạch lát nền hợp mệnh",
    "màu sơn phong thủy",
    "màu gạch ốp bếp",
  ],
});

export default function HouseColorPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.MS_TITLE}
      lead={UI.MS_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-mau-son-nha"
    >
      <SeoSchemas
        path={PATH}
        title={UI.MS_TITLE}
        description={UI.MS_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.MS_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <ColorTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.MS_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.MS_GUIDE} faq={UI.MS_FAQ} />
      </div>
    </ToolPageShell>
  );
}
