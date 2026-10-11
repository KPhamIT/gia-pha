import type { ReactNode } from "react";
import ShopPageView from "@/components/shop/ShopPageView";
import VanKhanHero from "@/components/van-khan/VanKhanHero";
import { UI } from "@/lib/constants/ui-strings";
import type { BreadcrumbItem } from "@/lib/seo/types";
import ToolTabs from "./ToolTabs";

type Props = {
  title: string;
  lead: string;
  breadcrumbs: BreadcrumbItem[];
  active?: (typeof UI.TOOLS_LIST)[number]["key"];
  children: ReactNode;
};

/** Khung chung các trang công cụ: tiêu đề, tab công cụ, nội dung. */
export default function ToolPageShell({ title, lead, breadcrumbs, active, children }: Props) {
  return (
    <ShopPageView title={UI.TOOLS_NAV}>
      <VanKhanHero title={title} lead={lead} breadcrumbs={breadcrumbs} />
      <ToolTabs active={active} />
      <div className="bg-[#fcf9f4] px-4 py-8 md:px-10 md:py-12">{children}</div>
    </ShopPageView>
  );
}
