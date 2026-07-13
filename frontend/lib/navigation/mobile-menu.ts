import type { IconName } from "@/components/icons/icon-paths";
import { UI } from "@/lib/constants/ui-strings";

export type MobileMenuLink = {
  href: string;
  label: string;
  icon: IconName;
  tone?: string;
};

/** Lối tắt ngang (giống Facebook shortcuts). */
export const MOBILE_MENU_SHORTCUTS: readonly MobileMenuLink[] = [
  {
    href: "/book",
    label: UI.MOBILE_NAV_BOOK,
    icon: "book",
    tone: "bg-[#ffdcc5] text-[#663100]",
  },
  {
    href: "/family-tree",
    label: UI.MOBILE_NAV_FAMILY,
    icon: "tree",
    tone: "bg-[#d4e8d0] text-[#1b4332]",
  },
  {
    href: "/events",
    label: UI.MOBILE_NAV_EVENTS,
    icon: "calendar",
    tone: "bg-[#dce8f5] text-[#1e3a5f]",
  },
  {
    href: "/ceremonies/upcoming",
    label: UI.NOTIF_OPEN_UPCOMING,
    icon: "calendar",
    tone: "bg-[#f5e6d3] text-[#5c3d1e]",
  },
  {
    href: "/bai-viet",
    label: UI.LANDING_NAV_LIBRARY,
    icon: "book",
    tone: "bg-[#ebe8e3] text-[#321716]",
  },
] as const;

/** Mục chính luôn hiện. */
export const MOBILE_MENU_PRIMARY: readonly MobileMenuLink[] = [
  { href: "/family-tree", label: UI.LANDING_NAV_CLAN, icon: "tree" },
  { href: "/book", label: UI.MOBILE_NAV_BOOK, icon: "book" },
  { href: "/events", label: UI.LANDING_NAV_EVENTS, icon: "calendar" },
  {
    href: "/ceremonies/upcoming",
    label: UI.NOTIF_OPEN_UPCOMING,
    icon: "calendar",
  },
  { href: "/bai-viet", label: UI.LANDING_NAV_LIBRARY, icon: "book" },
] as const;

/** Mục hiện khi bấm Xem thêm. */
export const MOBILE_MENU_MORE: readonly MobileMenuLink[] = [
  { href: "/dich-vu", label: UI.LANDING_NAV_SERVICES, icon: "layers" },
  { href: "/huong-dan", label: UI.PUBLIC_FOOTER_GUIDE, icon: "book" },
  { href: "/gioi-thieu", label: UI.PUBLIC_FOOTER_ABOUT, icon: "image" },
  { href: "/cai-dat", label: UI.INSTALL_PAGE_TITLE, icon: "download" },
] as const;

export const MOBILE_MENU_HELP: readonly MobileMenuLink[] = [
  { href: "/huong-dan", label: UI.GUIDE_PAGE_TITLE, icon: "book" },
  { href: "/lien-he", label: UI.CONTACT_PAGE_TITLE, icon: "share" },
  { href: "/cai-dat", label: UI.INSTALL_PAGE_TITLE, icon: "download" },
] as const;

export const MOBILE_MENU_SETTINGS: readonly MobileMenuLink[] = [
  { href: "/account", label: UI.ACCOUNT_TITLE, icon: "userPlus" },
  {
    href: "/settings/notifications",
    label: UI.NOTIF_OPEN_SETTINGS,
    icon: "settings",
  },
  {
    href: "/book/covers",
    label: UI.COVER_STUDIO_OPEN,
    icon: "book",
  },
  {
    href: "/ceremonies/templates",
    label: UI.CEREMONY_TEMPLATES_OPEN,
    icon: "edit",
  },
] as const;
