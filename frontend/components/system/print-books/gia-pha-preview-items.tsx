import type { BookSettings } from "@/components/family-tree/book/book-settings";
import { A4_RATIO, ScaledCover, type CoverContent, type CoverSample } from "@/components/shop/cover-samples";
import type { ShowcaseItem } from "@/components/shop/showcase-types";
import { UI } from "@/lib/constants/ui-strings";
import A4Preview from "./A4Preview";
import { BlankProfileSheet, PrefaceSheet } from "./BlankBookPages";

type Input = {
  sample: CoverSample;
  content: CoverContent;
  fontFamily: string;
  settings: BookSettings;
  footer: string;
  pages: number;
};

/** Mục xem trước sổ gia phả: bìa (lật trước / sau), Lời mở đầu, trang hồ sơ trống. */
export function giaPhaPreviewItems({ sample, content, fontFamily, settings, footer, pages }: Input): ShowcaseItem[] {
  return [
    {
      key: "cover",
      label: UI.PRINT_BOOKS_ITEM_COVER,
      ratio: A4_RATIO,
      thick: true,
      renderFront: (w) => <ScaledCover {...sample} width={w} variant="giaPha" fontFamily={fontFamily} content={content} />,
      renderBack: (w) => (
        <ScaledCover {...sample} side="back" width={w} variant="giaPha" fontFamily={fontFamily} content={content} />
      ),
    },
    {
      key: "preface",
      label: UI.BOOK_PREFACE_TITLE_DEFAULT,
      ratio: A4_RATIO,
      renderFront: (w) => (
        <A4Preview width={w}>
          <PrefaceSheet settings={settings} />
        </A4Preview>
      ),
    },
    {
      key: "profile",
      label: UI.PRINT_BOOKS_ITEM_PROFILE,
      ratio: A4_RATIO,
      renderFront: (w) => (
        <A4Preview width={w}>
          <BlankProfileSheet settings={settings} clanFooterLabel={footer} pageNumber={1} totalPages={pages} />
        </A4Preview>
      ),
    },
  ];
}
