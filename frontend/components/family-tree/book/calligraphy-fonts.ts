// Registry of Vietnamese calligraphy (thư pháp) fonts available for the book.
// Each cssValue references an @font-face declared in app/globals.css.

import { UI } from "@/lib/constants/ui-strings";

export type CalligraphyFont = {
  id: string;
  label: string;
  /** Ready-to-use CSS font-family value. */
  cssValue: string;
};

export const CALLIGRAPHY_FONTS: CalligraphyFont[] = [
  {
    id: "thanhcong",
    label: "Thư Pháp Thành Công",
    cssValue: '"Thuphap-Thanh-Cong", serif',
  },
  { id: "xuan", label: "Thư Pháp Xuân", cssValue: '"Thuphap-Xuan", serif' },
  { id: "thuphap", label: "VNI Thư Pháp", cssValue: '"VNI-Thuphap", serif' },
  { id: "thufap", label: "VNI Thư Pháp 3", cssValue: '"VNI-Thufap", serif' },
  { id: "thufap2", label: "VNI Thư Pháp 2", cssValue: '"VNI-Thufap2", serif' },
  {
    id: "thufapfan",
    label: "VNI Thư Pháp Fan",
    cssValue: '"VNI-Thufapfan", serif',
  },
  { id: "vnithufap", label: "Thư Pháp Mềm", cssValue: '"vnithufap", serif' },
  {
    id: "vnithufap2",
    label: "Thư Pháp Mềm 2",
    cssValue: '"vnithufap2", serif',
  },
  {
    id: "vnithufapfan",
    label: "Thư Pháp Mềm Fan",
    cssValue: '"vnithufapfan", serif',
  },
  {
    id: "slogan",
    label: "Thư Pháp Slogan",
    cssValue: '"vnithuphapslogan", serif',
  },
];

export const DEFAULT_CALLIGRAPHY_FONT_ID = "thanhcong";

/** Không chọn thư pháp — dùng font hệ thống khi thêm chữ export. */
export const EXPORT_NORMAL_FONT_ID = "";

export const NORMAL_TEXT_FONT_FAMILY =
  "'Times New Roman', 'Songti SC', serif";

/** Font chèn chữ trên màn export. */
export const EXPORT_TEXT_FONT_BE_VIETNAM_ID = "be-vietnam-pro";
export const EXPORT_TEXT_FONT_PLAYFAIR_ID = "playfair-display";
export const EXPORT_TEXT_FONT_THU_PHAP_THANH_CONG_ID = "thanhcong";

export type ExportTextFont = {
  id: string;
  label: string;
  cssValue: string;
  embedFamily?: string;
  embedFile?: string;
};

export const EXPORT_TEXT_FONTS: ExportTextFont[] = [
  {
    id: EXPORT_NORMAL_FONT_ID,
    label: UI.EXPORT_TEXT_FONT_NORMAL,
    cssValue: NORMAL_TEXT_FONT_FAMILY,
  },
  {
    id: EXPORT_TEXT_FONT_BE_VIETNAM_ID,
    label: UI.EXPORT_TEXT_FONT_BE_VIETNAM,
    cssValue: '"Be Vietnam Pro", system-ui, sans-serif',
    embedFamily: "Be Vietnam Pro",
    embedFile:
      "https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTSyLNBP8MEhGk24aaLT_gAA.woff2",
  },
  {
    id: EXPORT_TEXT_FONT_PLAYFAIR_ID,
    label: UI.EXPORT_TEXT_FONT_PLAYFAIR,
    cssValue: '"Playfair Display", Georgia, serif',
    embedFamily: "Playfair Display",
    embedFile:
      "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2",
  },
  {
    id: EXPORT_TEXT_FONT_THU_PHAP_THANH_CONG_ID,
    label: "Thư Pháp Thành Công",
    cssValue: '"Thuphap-Thanh-Cong", serif',
    embedFamily: "Thuphap-Thanh-Cong",
    embedFile: "/fonts/THUPHAPTHANHCONG3a.woff2",
  },
];

export function isExportTextFontId(fontId: string): boolean {
  return EXPORT_TEXT_FONTS.some((font) => font.id === fontId);
}

export function getExportTextFontEmbed(
  fontId: string,
): { family: string; file: string } | null {
  const font = EXPORT_TEXT_FONTS.find((item) => item.id === fontId);
  if (!font?.embedFamily || !font.embedFile) return null;
  return { family: font.embedFamily, file: font.embedFile };
}

export function isCalligraphyFontId(fontId: string): boolean {
  return CALLIGRAPHY_FONTS.some((font) => font.id === fontId);
}

export function getCalligraphyFont(id: string): CalligraphyFont {
  return CALLIGRAPHY_FONTS.find((f) => f.id === id) ?? CALLIGRAPHY_FONTS[0];
}

export function resolveExportTextFontFamily(fontId: string): string {
  const exportFont = EXPORT_TEXT_FONTS.find((font) => font.id === fontId);
  if (exportFont) return exportFont.cssValue;
  if (!fontId) return NORMAL_TEXT_FONT_FAMILY;
  if (isCalligraphyFontId(fontId)) return getCalligraphyFont(fontId).cssValue;
  return NORMAL_TEXT_FONT_FAMILY;
}
