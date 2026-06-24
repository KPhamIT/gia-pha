"use client";

import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import BookPageShell from "@/components/ui/BookPageShell";
import FamilyTreeStatus from "@/components/family-tree/graph/FamilyTreeStatus";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useAuthStore } from "@/store/authStore";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useRequireOrgAccess } from "@/hooks/useRequireOrgAccess";
import { useTheme } from "@/hooks/useTheme";
import { UI } from "@/lib/constants/ui-strings";
import {
  filterDemoPersons,
  filterDemoRelationships,
} from "@/utils/demo-filter";

const EventsManager = dynamic(
  () => import("@/components/family-tree/events/EventsManager"),
  { ssr: false },
);

export default function EventsPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <EventsPageContent />
    </Suspense>
  );
}

function EventsPageContent() {
  const searchParams = useSearchParams();
  const demoMode = searchParams.get("demo") === "1";
  const { theme } = useTheme();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const { ready: orgReady } = useRequireOrgAccess({ skip: demoMode });
  const { treeData, loading, error } = useFamilyTree({
    enabled: orgReady,
    demo: demoMode,
  });

  useEffect(() => {
    if (demoMode) return;
    void refreshAuth();
  }, [demoMode, refreshAuth]);

  if (!orgReady || (loading && !treeData)) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }

  if (error && !treeData) {
    return <FamilyTreeStatus theme={theme} type="error" message={error} />;
  }

  if (!treeData) {
    return <FamilyTreeStatus theme={theme} type="empty" />;
  }

  const persons = demoMode ? filterDemoPersons(treeData.persons) : treeData.persons;
  const relationships = demoMode
    ? filterDemoRelationships(treeData.relationships, persons)
    : treeData.relationships;

  return (
    <>
      <NotificationOptInBanner />

      <BookPageShell title={UI.EVENTS_TITLE} subtitle={UI.EVENTS_SUBTITLE}>
        <EventsManager
          persons={persons}
          relationships={relationships}
          standalone
          demo={demoMode}
        />
      </BookPageShell>

      <AuthRequiredSheet />
    </>
  );
}
