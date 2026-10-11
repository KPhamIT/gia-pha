import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import RoomTool from "@/components/phong-thuy/RoomTool";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-vi-tri-phong";

export const metadata: Metadata = createMetadata({
  title: UI.VT_TITLE,
  description: UI.VT_META_DESC,
  path: PATH,
  keywords: [
    "vị trí đặt bếp hợp tuổi",
    "hướng phòng ngủ hợp tuổi",
    "vị trí nhà vệ sinh",
    "bố trí nhà theo bát trạch",
    "hướng bàn thờ",
  ],
});

export default function RoomPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.VT_TITLE}
      lead={UI.VT_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-vi-tri-phong"
    >
      <SeoSchemas
        path={PATH}
        title={UI.VT_TITLE}
        description={UI.VT_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.VT_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <RoomTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.VT_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.VT_GUIDE} faq={UI.VT_FAQ} />
      </div>
    </ToolPageShell>
  );
}
