import type { Metadata } from "next";
import GioReminderForm from "@/components/gio-reminder/GioReminderForm";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ShopPageView from "@/components/shop/ShopPageView";
import VanKhanHero from "@/components/van-khan/VanKhanHero";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/nhac-ngay-gio";

export const metadata: Metadata = createMetadata({
  title: UI.GR_TITLE,
  description: UI.GR_META_DESC,
  path: PATH,
  keywords: ["nhắc ngày giỗ", "nhắc giỗ âm lịch", "ngày giỗ ông bà", "lịch giỗ", "báo ngày giỗ qua email"],
});

export default function GioReminderPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);
  return (
    <ShopPageView title={UI.GR_TITLE}>
      <SeoSchemas path={PATH} title={UI.GR_TITLE} description={UI.GR_META_DESC} breadcrumbs={breadcrumbs} />
      <VanKhanHero title={UI.GR_TITLE} lead={UI.GR_LEAD} breadcrumbs={breadcrumbs} />
      <div className="bg-[#fcf9f4] px-4 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-lg">
          <GioReminderForm />
        </div>
      </div>
    </ShopPageView>
  );
}
