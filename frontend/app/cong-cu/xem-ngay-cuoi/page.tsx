import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import WeddingDayTool from "@/components/xem-ngay-cuoi/WeddingDayTool";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-ngay-cuoi";

export const metadata: Metadata = createMetadata({
  title: UI.XC_TITLE,
  description: UI.XC_META_DESC,
  path: PATH,
  keywords: [
    "xem ngày cưới",
    "xem ngày cưới hỏi",
    "tháng đại lợi",
    "kim lâu cưới",
    "chu đường giá thú",
    "giờ đón dâu",
  ],
});

export default function WeddingDayPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.XC_TITLE}
      lead={UI.XC_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-ngay-cuoi"
    >
      <SeoSchemas
        path={PATH}
        title={UI.XC_TITLE}
        description={UI.XC_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.XC_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <WeddingDayTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.XC_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.XC_GUIDE} faq={UI.XC_FAQ} />
      </div>
    </ToolPageShell>
  );
}
