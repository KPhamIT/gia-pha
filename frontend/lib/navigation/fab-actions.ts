import type { IconName } from "@/components/icons/icon-paths";
import type { StandardFeatureKey } from "@/lib/auth/standard-features";
import { UI } from "@/lib/constants/ui-strings";

export type FabAction =
  | "add"
  | "search"
  | "center"
  | "book"
  | "tree"
  | "events"
  | "export"
  | "ceremonyTemplates"
  | "users"
  | "notifications"
  | "account";

export type FabPageContext = "tree" | "book" | "events" | "general";

export type FabMenuItem = { id: FabAction; label: string; icon: IconName };

type FabItemDef = {
  id: FabAction;
  label: string;
  icon: IconName;
  feature?: StandardFeatureKey;
  /** Chỉ hiện trên các context này */
  contexts: FabPageContext[];
  /** Ẩn khi đang ở path (tránh mở lại trang hiện tại) */
  hideWhenPath?: string | string[];
};

const FAB_ITEM_DEFS: FabItemDef[] = [
  {
    id: "add",
    label: UI.ADD_PERSON,
    icon: "plus",
    feature: "editTree",
    contexts: ["tree"],
  },
  {
    id: "search",
    label: UI.SEARCH_PERSON,
    icon: "search",
    feature: "search",
    contexts: ["tree"],
  },
  {
    id: "book",
    label: UI.VIEW_GENEALOGY_BOOK,
    icon: "book",
    feature: "book",
    contexts: ["tree", "events", "general"],
    hideWhenPath: "/book",
  },
  {
    id: "tree",
    label: UI.OPEN_FAMILY_TREE,
    icon: "center",
    feature: "tree",
    contexts: ["book", "events", "general"],
    hideWhenPath: "/family-tree",
  },
  {
    id: "events",
    label: UI.EVENTS_FAB,
    icon: "calendar",
    feature: "events",
    contexts: ["tree", "book", "general"],
    hideWhenPath: "/events",
  },
  {
    id: "export",
    label: UI.BTN_EXPORT,
    icon: "image",
    feature: "tree",
    contexts: ["tree"],
  },
  {
    id: "center",
    label: UI.BTN_CENTER,
    icon: "center",
    feature: "tree",
    contexts: ["tree"],
  },
  {
    id: "ceremonyTemplates",
    label: UI.CEREMONY_TEMPLATES_OPEN,
    icon: "print",
    contexts: ["tree", "book", "events", "general"],
    hideWhenPath: "/ceremonies/templates",
  },
  {
    id: "users",
    label: UI.BTN_USERS,
    icon: "userPlus",
    contexts: ["tree", "book", "events", "general"],
    hideWhenPath: ["/org-users", "/system/admins"],
  },
  {
    id: "notifications",
    label: UI.NOTIF_OPEN_CENTER,
    icon: "calendar",
    contexts: ["tree", "book", "events", "general"],
    hideWhenPath: ["/notifications", "/settings/notifications"],
  },
  {
    id: "account",
    label: UI.ACCOUNT_OPEN,
    icon: "userPlus",
    contexts: ["tree", "book", "events", "general"],
    hideWhenPath: "/account",
  },
];

export function resolveFabPageContext(
  pathname: string,
  onTreePage: boolean,
): FabPageContext {
  if (onTreePage || pathname === "/family-tree") return "tree";
  if (pathname === "/book") return "book";
  if (pathname === "/events") return "events";
  return "general";
}

function isHiddenOnPath(def: FabItemDef, pathname: string): boolean {
  if (!def.hideWhenPath) return false;
  const paths = Array.isArray(def.hideWhenPath)
    ? def.hideWhenPath
    : [def.hideWhenPath];
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

type BuildFabMenuOptions = {
  context: FabPageContext;
  pathname: string;
  canUseFeature: (key: StandardFeatureKey) => boolean;
  canViewCeremonyTemplates: boolean;
  isAdmin: boolean;
  isSystem: boolean;
};

export function buildFabMenuItems(options: BuildFabMenuOptions): FabMenuItem[] {
  const {
    context,
    pathname,
    canUseFeature,
    canViewCeremonyTemplates,
    isAdmin,
    isSystem,
  } = options;

  return FAB_ITEM_DEFS.filter((def) => {
    if (!def.contexts.includes(context)) return false;
    if (isHiddenOnPath(def, pathname)) return false;
    if (def.feature && !canUseFeature(def.feature)) return false;
    if (def.id === "ceremonyTemplates" && !canViewCeremonyTemplates)
      return false;
    if (def.id === "users" && !isAdmin && !isSystem) return false;
    return true;
  }).map(({ id, label, icon }) => ({ id, label, icon }));
}
