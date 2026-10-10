import type { Metadata } from "next";
import SeoSchemas from "@/components/seo/SeoSchemas";
import VanKhanCard from "@/components/van-khan/VanKhanCard";
import VanKhanHero from "@/components/van-khan/VanKhanHero";
import VanKhanPageView from "@/components/van-khan/VanKhanPageView";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";
import { fetchPublicCeremonies } from "@/lib/van-khan/server-api";

const PATH = "/van-khan";

export const metadata: Metadata = createMetadata({
  title: UI.VAN_KHAN_LIST_TITLE,
  description: UI.VAN_KHAN_LIST_SUBTITLE,
  path: PATH,
  keywords: ["văn khấn", "bài cúng", "văn khấn cổ truyền", "văn khấn ngày giỗ", "văn khấn mồng một ngày rằm"],
  pageType: "collection",
});

export default async function VanKhanListPage() {
  const items = (await fetchPublicCeremonies()) ?? [];
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <VanKhanPageView>
      <SeoSchemas
        path={PATH}
        title={UI.VAN_KHAN_LIST_TITLE}
        description={UI.VAN_KHAN_LIST_SUBTITLE}
        pageType="collection"
        breadcrumbs={breadcrumbs}
      />
      <VanKhanHero
        title={UI.VAN_KHAN_LIST_TITLE}
        lead={UI.VAN_KHAN_LIST_SUBTITLE}
        breadcrumbs={breadcrumbs}
      />
      <div className="bg-[#fcf9f4] px-4 py-8 md:px-10 md:py-12">
        {items.length === 0 ? (
          <p className="text-[#504443]">{UI.VAN_KHAN_LIST_EMPTY}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <VanKhanCard key={item.slug} item={item} />
            ))}
          </ul>
        )}
      </div>
    </VanKhanPageView>
  );
}

export const revalidate = 3600;
