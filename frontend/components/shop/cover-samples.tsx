"use client";

import BackCoverFace from "@/components/cover-studio/BackCoverFace";
import CoverSheet from "@/components/cover-studio/CoverSheet";
import FrontCoverFace from "@/components/cover-studio/FrontCoverFace";
import {
  getCoverPalette,
  getCoverStyle,
  type CoverPaletteId,
  type CoverStyleId,
} from "@/components/cover-studio/cover-templates";
import {
  defaultBackContent,
  defaultFrontContent,
  type CoverBackContent,
  type CoverFrontContent,
} from "@/components/cover-studio/cover-studio-types";
import { formatCoverSubtitle } from "@/components/family-tree/book/book-cover-subtitle";
import { UI } from "@/lib/constants/ui-strings";

export type CoverSample = { styleId: CoverStyleId; paletteId: CoverPaletteId };

/** Mẫu bìa đưa lên trang bán — mỗi mẫu một bố cục/màu khác nhau trong Cover Studio. */
export const COVER_SAMPLES: CoverSample[] = [
  { styleId: "ornate", paletteId: "classic" },
  { styleId: "ornate", paletteId: "imperial" },
  { styleId: "scroll", paletteId: "classic" },
  { styleId: "ornate", paletteId: "elegant" },
  { styleId: "ornate", paletteId: "jade" },
  { styleId: "ornate", paletteId: "ivory" },
];

/** Bề rộng tờ A4 (210mm) tính theo px CSS. */
export const A4_WIDTH_PX = (210 * 96) / 25.4;
export const A4_RATIO = 297 / 210;

/** Sổ gia phả hay sách văn khấn — cùng mẫu bìa, chỉ khác chữ. */
export type CoverVariant = "giaPha" | "vanKhan";

/** Thông tin dòng họ in lên bìa. */
export type CoverClanInfo = {
  clanName: string;
  establishedYear?: string;
  clanAddress?: string;
};

export type CoverContent = { front: CoverFrontContent; back: CoverBackContent };

/** Văn khấn: chữ Hán 祭 文 (tế văn) thay cho 家 譜 (gia phả). */
const VAN_KHAN_BADGE = "祭 文";
const VAN_KHAN_SEAL = "祭";

/** Nội dung hai mặt bìa cho một dòng họ (dùng cho trang bán sách và công cụ in sách). */
export function buildCoverContent(variant: CoverVariant, info: CoverClanInfo): CoverContent {
  const front: CoverFrontContent = {
    ...defaultFrontContent(null),
    title: UI.SHOP_COVER_SAMPLE_TITLE,
    subtitle: info.clanName,
    establishedYear: info.establishedYear ?? "",
    clanAddress: info.clanAddress ?? "",
  };
  const back: CoverBackContent = {
    ...defaultBackContent(null),
    title: UI.SHOP_COVER_SAMPLE_TITLE,
    footer: formatCoverSubtitle(info.clanName),
  };
  if (variant === "giaPha") return { front, back };
  return {
    front: {
      ...front,
      title: UI.SHOP_PRAYER_COVER_TITLE,
      lineage: UI.SHOP_PRAYER_COVER_LINEAGE,
      badge: VAN_KHAN_BADGE,
      sealChar: VAN_KHAN_SEAL,
    },
    back: {
      ...back,
      title: UI.SHOP_PRAYER_COVER_TITLE,
      body: UI.SHOP_PRAYER_COVER_BACK_BODY,
      badge: VAN_KHAN_BADGE,
      sealChar: VAN_KHAN_SEAL,
    },
  };
}

const SAMPLE_CLAN: CoverClanInfo = {
  clanName: UI.SHOP_COVER_SAMPLE_CLAN,
  establishedYear: UI.SHOP_COVER_SAMPLE_YEAR,
  clanAddress: UI.SHOP_COVER_SAMPLE_ADDRESS,
};

const CONTENT: Record<CoverVariant, CoverContent> = {
  giaPha: buildCoverContent("giaPha", SAMPLE_CLAN),
  vanKhan: buildCoverContent("vanKhan", SAMPLE_CLAN),
};

export function coverLabel({ styleId, paletteId }: CoverSample): string {
  if (styleId === "scroll" && paletteId !== "imperial") return getCoverStyle(styleId).label;
  return getCoverPalette(paletteId).label;
}

export function coverRef({ styleId, paletteId }: CoverSample, variant: CoverVariant): string {
  const product = variant === "vanKhan" ? "sach-van-khan" : "so-gia-pha";
  return `${product}-bia-${styleId}-${paletteId}`;
}

type ScaledCoverProps = CoverSample & {
  width: number;
  side?: "front" | "back";
  variant?: CoverVariant;
  fontFamily: string;
  /** Nội dung riêng (vd. tên dòng họ của khách); mặc định dùng nội dung mẫu. */
  content?: CoverContent;
};

/** Một mặt bìa A4 thật (component Cover Studio) thu nhỏ về `width` px. */
export function ScaledCover({
  styleId,
  paletteId,
  width,
  side = "front",
  variant = "giaPha",
  fontFamily,
  content: customContent,
}: ScaledCoverProps) {
  const content = customContent ?? CONTENT[variant];
  return (
    <div style={{ width, height: width * A4_RATIO, overflow: "hidden" }}>
      <div style={{ transform: `scale(${width / A4_WIDTH_PX})`, transformOrigin: "top left" }}>
        <CoverSheet bleedMm={0} showCropMarks={false} showSafeGuide={false}>
          {side === "front" ? (
            <FrontCoverFace styleId={styleId} paletteId={paletteId} fontFamily={fontFamily} content={content.front} />
          ) : (
            <BackCoverFace styleId={styleId} paletteId={paletteId} fontFamily={fontFamily} content={content.back} />
          )}
        </CoverSheet>
      </div>
    </div>
  );
}
