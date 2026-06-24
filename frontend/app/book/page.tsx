"use client";

import { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import FamilyTreeStatus from "@/components/family-tree/graph/FamilyTreeStatus";
import AppNavFab from "@/components/navigation/AppNavFab";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import {
  consumeBookTouchRecovery,
  useAppNavigation,
} from "@/hooks/useAppNavigation";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useRequireOrgAccess } from "@/hooks/useRequireOrgAccess";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import {
  useOverlayPageRecovery,
  syncOverlayViewport,
} from "@/hooks/useOverlayViewport";
import { filterDemoPersons } from "@/utils/demo-filter";

const GenealogyBookViewer = dynamic(
  () => import("@/components/family-tree/book/GenealogyBookViewer"),
  { ssr: false },
);

export default function BookPage() {
  const searchParams = useSearchParams();
  const demoMode = searchParams.get("demo") === "1";
  const { theme } = useTheme();
  const nav = useAppNavigation();
  const goBack = useBackNavigation("/");
  const refreshAuth = useAuthStore((state) => state.refresh);
  const { ready: orgReady } = useRequireOrgAccess({ skip: demoMode });
  const { treeData, loading, error, reload } = useFamilyTree({
    enabled: orgReady,
    demo: demoMode,
  });

  const resetBookOverlays = useCallback(() => {
    syncOverlayViewport();
  }, []);

  useOverlayPageRecovery(resetBookOverlays);

  useEffect(() => {
    if (demoMode) return;
    void refreshAuth();
  }, [demoMode, refreshAuth]);

  useEffect(() => {
    if (!consumeBookTouchRecovery()) return;
    resetBookOverlays();
  }, [resetBookOverlays]);

  if (!orgReady || (loading && !treeData)) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }

  if (error && !treeData) {
    return (
      <FamilyTreeStatus
        theme={theme}
        type="error"
        message={error}
        onRetry={reload}
      />
    );
  }

  if (!treeData) {
    return <FamilyTreeStatus theme={theme} type="empty" />;
  }

  return (
    <>
      <NotificationOptInBanner />

      <GenealogyBookViewer
        persons={demoMode ? filterDemoPersons(treeData.persons) : treeData.persons}
        standalone
        onOpenTree={demoMode ? goBack : nav.openTree}
      />

      <AppNavFab />

      <AuthRequiredSheet />
    </>
  );
}
