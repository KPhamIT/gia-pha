"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import BookPageShell from "@/components/ui/BookPageShell";
import FamilyTreeStatus from "@/components/family-tree/graph/FamilyTreeStatus";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import { useAuthStore } from "@/store/authStore";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useRequireOrgAccess } from "@/hooks/useRequireOrgAccess";
import { useTheme } from "@/hooks/useTheme";
import { UI } from "@/lib/constants/ui-strings";

const EventsManager = dynamic(
  () => import("@/components/family-tree/events/EventsManager"),
  { ssr: false },
);

export default function EventsPage() {
  const { theme } = useTheme();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const { ready: orgReady } = useRequireOrgAccess();
  const { treeData, loading, error } = useFamilyTree({
    enabled: orgReady,
  });

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  if (!orgReady || (loading && !treeData)) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }

  if (error && !treeData) {
    return <FamilyTreeStatus theme={theme} type="error" message={error} />;
  }

  if (!treeData) {
    return <FamilyTreeStatus theme={theme} type="empty" />;
  }

  return (
    <>
      <NotificationOptInBanner />

      <BookPageShell title={UI.EVENTS_TITLE} subtitle={UI.EVENTS_SUBTITLE}>
        <EventsManager
          persons={treeData.persons}
          relationships={treeData.relationships}
          standalone
        />
      </BookPageShell>

      <AuthRequiredSheet />
    </>
  );
}
