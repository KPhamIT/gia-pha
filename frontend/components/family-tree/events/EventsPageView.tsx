"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Icon from "@/components/icons/Icon";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useRequireOrgAccess } from "@/hooks/useRequireOrgAccess";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";

const EventsManager = dynamic(
  () => import("@/components/family-tree/events/EventsManager"),
  { ssr: false },
);

function EventsStatusPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#d4c3c1] bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-[#504443]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl border border-[#d4c3c1] px-4 py-2 text-sm font-semibold text-[#321716]"
        >
          {UI.RETRY}
        </button>
      ) : null}
    </div>
  );
}

export default function EventsPageView() {
  const { canUseFeature } = useFeatureAccess();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const { ready: orgReady } = useRequireOrgAccess();
  const { treeData, loading, error, reload } = useFamilyTree({
    enabled: orgReady,
  });
  const openCreateRef = useRef<(() => void) | null>(null);
  const canEdit = canUseFeature("editEvents");

  const handleCreateRef = useCallback((openCreate: () => void) => {
    openCreateRef.current = openCreate;
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const fab =
    canEdit && treeData ? (
      <button
        type="button"
        onClick={() => openCreateRef.current?.()}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/20 bg-[#321716] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 md:hidden"
        aria-label={UI.EVENT_ADD}
      >
        <Icon
          path="plus"
          size={28}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </button>
    ) : null;

  const layout = (content: ReactNode) => (
    <>
      <NotificationOptInBanner />
      <ResponsiveAppPageLayout
        title={UI.EVENTS_TITLE}
        backHref="/book"
        fab={fab}
      >
        {content}
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );

  if (!orgReady) {
    return layout(
      <p className="text-sm text-[#504443]">{UI.EVENTS_LOADING}</p>,
    );
  }

  if (error && !treeData) {
    return layout(
      <EventsStatusPanel message={error} onRetry={() => void reload()} />,
    );
  }

  if (!loading && !treeData) {
    return layout(
      <EventsStatusPanel message={UI.NO_DATA} />,
    );
  }

  return layout(
    loading || !treeData ? (
      <p className="text-sm text-[#504443]">{UI.EVENTS_LOADING}</p>
    ) : (
      <EventsManager
        persons={treeData.persons}
        relationships={treeData.relationships}
        standalone
        onCreateRef={handleCreateRef}
      />
    ),
  );
}
