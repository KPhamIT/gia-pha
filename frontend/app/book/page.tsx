"use client";

import { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import FamilyTreeStatus from "@/components/family-tree/graph/FamilyTreeStatus";
import AppNavFab from "@/components/navigation/AppNavFab";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import {
  consumeBookTouchRecovery,
  useAppNavigation,
} from "@/hooks/useAppNavigation";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import {
  useOverlayPageRecovery,
  syncOverlayViewport,
} from "@/hooks/useOverlayViewport";

const GenealogyBookViewer = dynamic(
  () => import("@/components/family-tree/book/GenealogyBookViewer"),
  { ssr: false },
);

export default function BookPage() {
  const { theme } = useTheme();
  const nav = useAppNavigation();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const { treeData, loading, error, reload } = useFamilyTree();

  const resetBookOverlays = useCallback(() => {
    syncOverlayViewport();
  }, []);

  useOverlayPageRecovery(resetBookOverlays);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (!consumeBookTouchRecovery()) return;
    resetBookOverlays();
  }, [resetBookOverlays]);

  if (loading && !treeData) {
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
        persons={treeData.persons}
        standalone
        onOpenTree={nav.openTree}
      />

      <AppNavFab />

      <AuthRequiredSheet />
    </>
  );
}
