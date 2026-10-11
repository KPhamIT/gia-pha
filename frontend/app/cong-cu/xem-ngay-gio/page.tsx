import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ToolGuide from "@/components/tools/ToolGuide";
import ToolPageShell from "@/components/tools/ToolPageShell";
import DayPickerTool from "@/components/xem-ngay/DayPickerTool";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-ngay-gio";

export const metadata: Metadata = createMetadata({
  title: UI.XN_TITLE,
  description: UI.XN_META_DESC,
  path: PATH,
  keywords: [
    "xem ngày tốt",
    "ngày hoàng đạo",
    "giờ hoàng đạo",
    "xem ngày động thổ",
    "xem ngày nhập trạch",
  ],
});

export default function DayPickerPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell
      title={UI.XN_TITLE}
      lead={UI.XN_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-ngay-gio"
    >
      <SeoSchemas
        path={PATH}
        title={UI.XN_TITLE}
        description={UI.XN_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={UI.XN_FAQ.map((item) => ({ ...item }))}
      />
      <div className="mx-auto max-w-5xl">
        <DayPickerTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.XN_DISCLAIMER}
        </p>
        <ToolGuide guide={UI.XN_GUIDE} faq={UI.XN_FAQ} />
      </div>
    </ToolPageShell>
  );
}
