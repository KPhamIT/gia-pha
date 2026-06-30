import type { RelationshipType } from "@/components/types/family-tree-types";
import { CORE_STRINGS } from "./ui-strings/core";
import { ACCOUNT_STRINGS } from "./ui-strings/account";
import { BOOK_STRINGS } from "./ui-strings/book";
import { EVENT_STRINGS } from "./ui-strings/events";
import { EXPORT_STRINGS } from "./ui-strings/export";
import { NOTIFICATION_STRINGS } from "./ui-strings/notifications";
import { GUIDE_STRINGS } from "./ui-strings/guide";
import { PUBLIC_STRINGS } from "./ui-strings/public";
import { BLOG_UI } from "./ui-strings/blog";
import { BILLING_STRINGS } from "./ui-strings/billing";

/**
 * App-wide Vietnamese UI strings, merged from per-domain modules under
 * `ui-strings/` to keep each file small. Keys are unique across domains.
 */
export const UI = {
  ...CORE_STRINGS,
  ...ACCOUNT_STRINGS,
  ...BOOK_STRINGS,
  ...EVENT_STRINGS,
  ...EXPORT_STRINGS,
  ...NOTIFICATION_STRINGS,
  ...GUIDE_STRINGS,
  ...PUBLIC_STRINGS,
  ...BLOG_UI,
  ...BILLING_STRINGS,
} as const;

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  FATHER: "Bố",
  MOTHER: "Mẹ",
  CHILD: "Con",
  SPOUSE: "Vợ/Chồng",
};
