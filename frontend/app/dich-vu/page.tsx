import type { Metadata } from "next";
import Link from "next/link";
import SeoSchemas from "@/components/seo/SeoSchemas";
import CoverGallery from "@/components/shop/CoverGallery";
import LiveCoverImage from "@/components/shop/LiveCoverImage";
import PageGallery from "@/components/shop/PageGallery";
import ShopPageView from "@/components/shop/ShopPageView";
import ShopJumpLinks from "@/components/shop/ShopJumpLinks";
import ShopProduct from "@/components/shop/ShopProduct";
import ShopServices from "@/components/shop/ShopServices";
import ShopSteps from "@/components/shop/ShopSteps";
import VanKhanHero from "@/components/van-khan/VanKhanHero";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";
import { fetchPublicCeremonies } from "@/lib/van-khan/server-api";

const PATH = "/dich-vu";

export const metadata: Metadata = createMetadata({
  title: UI.SHOP_TITLE,
  description: UI.SHOP_META_DESC,
  path: PATH,
  keywords: [
    "dịch vụ gia phả",
    "in sổ gia phả",
    "in phả đồ",
    "nhập liệu gia phả",
    "sách văn khấn",
  ],
});

export default async function ServicesPage() {
  const ceremonies = (await fetchPublicCeremonies()) ?? [];
  const breadcrumbs = breadcrumbsFromPath(PATH);
  // Tiêu đề in gọn hơn tên mẫu; trùng nhau (vd. hai mẫu văn khấn ngày giỗ) thì giữ tên mẫu.
  const titleCount = new Map<string, number>();
  for (const item of ceremonies) {
    if (item.printTitle) titleCount.set(item.printTitle, (titleCount.get(item.printTitle) ?? 0) + 1);
  }
  const displayName = (item: (typeof ceremonies)[number]) =>
    item.printTitle && titleCount.get(item.printTitle) === 1 ? item.printTitle : item.name;

  return (
    <ShopPageView>
      <SeoSchemas
        path={PATH}
        title={UI.SHOP_TITLE}
        description={UI.SHOP_META_DESC}
        breadcrumbs={breadcrumbs}
      />
      <VanKhanHero
        title={UI.SHOP_TITLE}
        lead={UI.SHOP_LEAD}
        breadcrumbs={breadcrumbs}
        footer={<ShopJumpLinks />}
      />

      <div className="bg-[#fcf9f4]">
        <ShopProduct
          id="so-gia-pha"
          badge={UI.SHOP_BOOK_BADGE}
          title={UI.SHOP_BOOK_TITLE}
          description={UI.SHOP_BOOK_DESC}
          features={UI.SHOP_BOOK_FEATURES}
          priceNote={UI.SHOP_PRICE_QUOTE_BOOK}
          productRef="so-gia-pha"
          leadMedia={<LiveCoverImage alt={UI.SHOP_BOOK_IMG_COVER_ALT} />}
          images={[
            {
              src: "/images/blog/ho-so-thanh-vien-so-gia-pha-desktop.webp",
              alt: UI.SHOP_BOOK_IMG_PAGE_ALT,
              width: 840,
              height: 1100,
            },
          ]}
        >
          <h3 className="font-serif text-xl font-semibold text-[#321716]">
            {UI.SHOP_COVERS_TITLE}
          </h3>
          <p className="mb-6 mt-1 text-sm text-[#504443]">{UI.SHOP_COVERS_HINT}</p>
          <CoverGallery />

          <h3 className="mt-14 font-serif text-xl font-semibold text-[#321716]">
            {UI.SHOP_PAGES_TITLE}
          </h3>
          <p className="mb-8 mt-1 text-sm text-[#504443]">{UI.SHOP_PAGES_HINT}</p>
          <PageGallery />
        </ShopProduct>

        <ShopProduct
          id="sach-van-khan"
          badge={UI.SHOP_PRAYER_BADGE}
          title={UI.SHOP_PRAYER_TITLE}
          description={UI.SHOP_PRAYER_DESC}
          features={UI.SHOP_PRAYER_FEATURES}
          priceNote={UI.SHOP_PRICE_QUOTE_PRAYER}
          productRef="sach-van-khan"
          reverse
          leadMedia={
            <LiveCoverImage alt={UI.SHOP_PRAYER_COVER_IMG_ALT} variant="vanKhan" />
          }
          images={[
            {
              src: "/images/shop/sach-van-khan-trang-in.webp",
              alt: UI.SHOP_PRAYER_IMG_ALT,
              width: 827,
              height: 1170,
            },
          ]}
        >
          <h3 className="font-serif text-xl font-semibold text-[#321716]">
            {UI.SHOP_PRAYER_COVERS_TITLE}
          </h3>
          <p className="mb-6 mt-1 text-sm text-[#504443]">{UI.SHOP_PRAYER_COVERS_HINT}</p>
          <CoverGallery variant="vanKhan" />

          {ceremonies.length > 0 ? (
            <>
              <h3 className="mt-14 font-serif text-xl font-semibold text-[#321716]">
                {UI.SHOP_PRAYER_LIST_TITLE(ceremonies.length)}
              </h3>
              <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {ceremonies.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/van-khan/${item.slug}`}
                      className="text-[#504443] underline-offset-2 hover:text-[#944a00] hover:underline"
                    >
                      {displayName(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </ShopProduct>

        <ShopServices />
        <ShopSteps />
      </div>
    </ShopPageView>
  );
}

export const revalidate = 3600;
