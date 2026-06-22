"use client";

import { usePathname } from "next/navigation";
import TreeFab from "@/components/family-tree/graph/TreeFab";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { resolveFabPageContext } from "@/lib/navigation/fab-actions";

export type TreeLocalActions = {
  onAddPerson: () => void;
  onSearch: () => void;
  onCenterTree: () => void;
  onOpenExport: () => void;
};

type AppNavFabProps = {
  /** Hành động chỉ dùng trên `/family-tree`. */
  treeActions?: TreeLocalActions;
};

export default function AppNavFab({ treeActions }: AppNavFabProps) {
  const pathname = usePathname();
  const nav = useAppNavigation();
  const { canUseFeature, canMutate, isAdmin } = useFeatureAccess();
  const context = resolveFabPageContext(pathname, treeActions != null);
  const noop = () => {};

  return (
    <TreeFab
      context={context}
      pathname={pathname}
      canUseFeature={canUseFeature}
      canManageCeremonyTemplates={canMutate}
      isAdmin={isAdmin}
      onAddPerson={treeActions?.onAddPerson ?? noop}
      onSearch={treeActions?.onSearch ?? noop}
      onCenterTree={treeActions?.onCenterTree ?? noop}
      onOpenBook={nav.openBook}
      onOpenTree={nav.openTree}
      onOpenEvents={nav.openEvents}
      onOpenExport={treeActions?.onOpenExport ?? noop}
      onOpenCeremonyTemplates={nav.openCeremonyTemplates}
      onOpenUsers={nav.openUsers}
      onOpenNotifications={nav.openNotifications}
      onOpenAccount={nav.openAccount}
    />
  );
}
