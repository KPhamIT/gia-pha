import { defaultBookSettings, type BookSettings } from "@/components/family-tree/book/book-settings";
import { UI } from "@/lib/constants/ui-strings";

/** Cài đặt sổ gia phả trống (Lời mở đầu điền tên dòng họ, không đánh số trang). */
export function blankBookSettings(
  clanName: string,
  fontId: string,
  styles: Partial<Pick<BookSettings, "borderStyleId" | "formStyleId">> = {},
): BookSettings {
  const base = defaultBookSettings();
  return {
    ...base,
    borderStyleId: styles.borderStyleId ?? base.borderStyleId,
    formStyleId: styles.formStyleId ?? base.formStyleId,
    coverFontId: fontId,
    prefaceBody: UI.PRINT_BOOKS_PREFACE_BODY(clanName || "…………"),
    prefaceSignature: "",
    showPageNumbers: false,
  };
}
