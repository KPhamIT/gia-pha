import { UI } from "@/lib/constants/ui-strings";

export type MobileBottomNavId = "home" | "family" | "events" | "profile";

export type MobileBottomNavItem = {
  id: MobileBottomNavId;
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

export const MOBILE_BOTTOM_NAV_ITEMS: readonly MobileBottomNavItem[] = [
  {
    id: "home",
    label: UI.MOBILE_NAV_HOME,
    href: "/book",
    match: (pathname) => pathname === "/book" || pathname === "/",
  },
  {
    id: "family",
    label: UI.MOBILE_NAV_FAMILY,
    href: "/family-tree",
    match: (pathname) => pathname.startsWith("/family-tree"),
  },
  {
    id: "events",
    label: UI.MOBILE_NAV_EVENTS,
    href: "/events",
    match: (pathname) =>
      pathname.startsWith("/events") || pathname.startsWith("/ceremonies"),
  },
  {
    id: "profile",
    label: UI.MOBILE_NAV_PROFILE,
    href: "/account",
    match: (pathname) => pathname.startsWith("/account"),
  },
] as const;

export function resolveMobileBottomNavId(pathname: string): MobileBottomNavId | null {
  const item = MOBILE_BOTTOM_NAV_ITEMS.find((entry) => entry.match(pathname));
  return item?.id ?? null;
}
