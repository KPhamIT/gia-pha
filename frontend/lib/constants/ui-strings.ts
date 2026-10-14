import type { RelationshipType } from "@/components/types/family-tree-types";
import { CORE_STRINGS } from "./ui-strings/core";
import { ACCOUNT_STRINGS } from "./ui-strings/account";
import { BOOK_STRINGS } from "./ui-strings/book";
import { COVER_STUDIO_STRINGS } from "./ui-strings/cover-studio";
import { EVENT_STRINGS } from "./ui-strings/events";
import { EXPORT_STRINGS } from "./ui-strings/export";
import { NOTIFICATION_STRINGS } from "./ui-strings/notifications";
import { GUIDE_STRINGS } from "./ui-strings/guide";
import { INSTALL_PAGE_STRINGS } from "./ui-strings/install-page";
import { PUBLIC_STRINGS } from "./ui-strings/public";
import { BLOG_UI } from "./ui-strings/blog";
import { BILLING_STRINGS } from "./ui-strings/billing";
import { PAGINATION_STRINGS } from "./ui-strings/pagination";
import { NOTES_STRINGS } from "./ui-strings/notes";
import { CLAN_DUTY_STRINGS } from "./ui-strings/clan-duty";
import { VAN_KHAN_STRINGS } from "./ui-strings/van-khan";
import { EXCEL_STRINGS } from "./ui-strings/excel";
import { SHOP_STRINGS } from "./ui-strings/shop";
import { PRINT_BOOKS_STRINGS } from "./ui-strings/print-books";
import { KINSHIP_STRINGS } from "./ui-strings/kinship";
import { DAT_TEN_STRINGS } from "./ui-strings/dat-ten";
import { DAT_TEN_GUIDE_STRINGS } from "./ui-strings/dat-ten-guide";
import { MAU_SON_STRINGS } from "./ui-strings/mau-son";
import { MAU_SON_GUIDE_STRINGS } from "./ui-strings/mau-son-guide";
import { PHONG_THUY_STRINGS } from "./ui-strings/phong-thuy";
import { SINH_CON_STRINGS } from "./ui-strings/sinh-con";
import { SINH_CON_GUIDE_STRINGS } from "./ui-strings/sinh-con-guide";
import { TOOLS_STRINGS } from "./ui-strings/tools";
import { TOOLS_GUIDE_STRINGS } from "./ui-strings/tools-guide";
import { VAT_PHAM_STRINGS } from "./ui-strings/vat-pham";
import { VI_TRI_STRINGS } from "./ui-strings/vi-tri";
import { XEM_NGAY_STRINGS } from "./ui-strings/xem-ngay";
import { XEM_NGAY_CUOI_STRINGS } from "./ui-strings/xem-ngay-cuoi";
import { XEM_NGAY_CUOI_GUIDE_STRINGS } from "./ui-strings/xem-ngay-cuoi-guide";
import { XEM_TUOI_STRINGS } from "./ui-strings/xem-tuoi";
import { XEM_TUOI_GUIDE_STRINGS } from "./ui-strings/xem-tuoi-guide";
import { XEM_TUOI_IMPACT_STRINGS } from "./ui-strings/xem-tuoi-impact";

/**
 * App-wide Vietnamese UI strings, merged from per-domain modules under
 * `ui-strings/` to keep each file small. Keys are unique across domains.
 */
export const UI = {
  ...CORE_STRINGS,
  ...ACCOUNT_STRINGS,
  ...BOOK_STRINGS,
  ...COVER_STUDIO_STRINGS,
  ...EVENT_STRINGS,
  ...EXPORT_STRINGS,
  ...NOTIFICATION_STRINGS,
  ...GUIDE_STRINGS,
  ...INSTALL_PAGE_STRINGS,
  ...PUBLIC_STRINGS,
  ...BLOG_UI,
  ...BILLING_STRINGS,
  ...PAGINATION_STRINGS,
  ...NOTES_STRINGS,
  ...CLAN_DUTY_STRINGS,
  ...VAN_KHAN_STRINGS,
  ...EXCEL_STRINGS,
  ...SHOP_STRINGS,
  ...PRINT_BOOKS_STRINGS,
  ...KINSHIP_STRINGS,
  ...TOOLS_STRINGS,
  ...TOOLS_GUIDE_STRINGS,
  ...PHONG_THUY_STRINGS,
  ...MAU_SON_STRINGS,
  ...MAU_SON_GUIDE_STRINGS,
  ...VI_TRI_STRINGS,
  ...VAT_PHAM_STRINGS,
  ...XEM_NGAY_STRINGS,
  ...XEM_NGAY_CUOI_STRINGS,
  ...XEM_NGAY_CUOI_GUIDE_STRINGS,
  ...SINH_CON_STRINGS,
  ...SINH_CON_GUIDE_STRINGS,
  ...DAT_TEN_STRINGS,
  ...DAT_TEN_GUIDE_STRINGS,
  ...XEM_TUOI_STRINGS,
  ...XEM_TUOI_GUIDE_STRINGS,
  ...XEM_TUOI_IMPACT_STRINGS,
} as const;

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  FATHER: "Bố",
  MOTHER: "Mẹ",
  CHILD: "Con",
  SPOUSE: "Vợ/Chồng",
};
