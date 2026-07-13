import { UI } from "@/lib/constants/ui-strings";

/** Loại bố cục bìa. */
export type CoverStyleId = "ornate" | "scroll";

/** Bảng màu dùng chung cho mọi loại bố cục. */
export type CoverPaletteId =
  | "classic"
  | "elegant"
  | "ivory"
  | "jade"
  | "imperial";

/** @deprecated — chỉ để migrate bản lưu cũ. */
export type CoverTemplateId =
  | CoverPaletteId
  | "heritage"
  | "imperial";

export type CoverStyleMeta = {
  id: CoverStyleId;
  label: string;
};

export type CoverPaletteMeta = {
  id: CoverPaletteId;
  label: string;
  swatch: string;
};

export const COVER_STYLES: CoverStyleMeta[] = [
  { id: "ornate", label: UI.COVER_STUDIO_STYLE_ORNATE },
  { id: "scroll", label: UI.COVER_STUDIO_STYLE_SCROLL },
];

export const COVER_PALETTES: CoverPaletteMeta[] = [
  {
    id: "classic",
    label: UI.COVER_STUDIO_TEMPLATE_CLASSIC,
    swatch: "linear-gradient(160deg, #7a1410, #420808)",
  },
  {
    id: "elegant",
    label: UI.COVER_STUDIO_TEMPLATE_ELEGANT,
    swatch: "linear-gradient(160deg, #1a1a1a, #0a0a0a)",
  },
  {
    id: "ivory",
    label: UI.COVER_STUDIO_TEMPLATE_IVORY,
    swatch: "linear-gradient(160deg, #f3e6c8, #d4b896)",
  },
  {
    id: "jade",
    label: UI.COVER_STUDIO_TEMPLATE_JADE,
    swatch: "linear-gradient(160deg, #0f3d2e, #062218)",
  },
  {
    id: "imperial",
    label: UI.COVER_STUDIO_TEMPLATE_IMPERIAL,
    swatch: "linear-gradient(160deg, #8b1510, #4a0808)",
  },
];

export const DEFAULT_COVER_STYLE_ID: CoverStyleId = "ornate";
export const DEFAULT_COVER_PALETTE_ID: CoverPaletteId = "classic";
/** @deprecated */
export const DEFAULT_COVER_TEMPLATE_ID = DEFAULT_COVER_PALETTE_ID;

export function isCoverStyleId(value: string): value is CoverStyleId {
  return COVER_STYLES.some((s) => s.id === value);
}

export function isCoverPaletteId(value: string): value is CoverPaletteId {
  return COVER_PALETTES.some((p) => p.id === value);
}

export function getCoverStyle(id: string): CoverStyleMeta {
  return COVER_STYLES.find((s) => s.id === id) ?? COVER_STYLES[0];
}

export function getCoverPalette(id: string): CoverPaletteMeta {
  return COVER_PALETTES.find((p) => p.id === id) ?? COVER_PALETTES[0];
}

/** Migrate `templateId` cũ → style + palette. */
export function migrateLegacyTemplate(templateId: string): {
  styleId: CoverStyleId;
  paletteId: CoverPaletteId;
} {
  if (templateId === "heritage") {
    return { styleId: "scroll", paletteId: "classic" };
  }
  if (templateId === "imperial") {
    return { styleId: "ornate", paletteId: "imperial" };
  }
  if (isCoverPaletteId(templateId)) {
    return { styleId: "ornate", paletteId: templateId };
  }
  return {
    styleId: DEFAULT_COVER_STYLE_ID,
    paletteId: DEFAULT_COVER_PALETTE_ID,
  };
}

/** Nhãn hiển thị danh sách mẫu. */
export function coverDesignKindLabel(
  styleId: CoverStyleId,
  paletteId: CoverPaletteId,
): string {
  return `${getCoverStyle(styleId).label} · ${getCoverPalette(paletteId).label}`;
}

/** Swatch preview theo palette (+ màu cam riêng cho cuốn thư / classic). */
export function coverDesignSwatch(
  paletteId: CoverPaletteId,
  styleId?: CoverStyleId,
): string {
  if (styleId === "scroll" && paletteId === "classic") {
    return "linear-gradient(160deg, #e07828, #c45a18)";
  }
  return getCoverPalette(paletteId).swatch;
}

/** Ornate + imperial → bố cục chữ riêng; scroll → cuốn thư; còn lại → khung giữa. */
export function resolveCoverLayout(
  styleId: CoverStyleId,
  paletteId: CoverPaletteId,
): "centered" | "scroll" | "imperial" {
  if (styleId === "scroll") return "scroll";
  if (paletteId === "imperial") return "imperial";
  return "centered";
}
