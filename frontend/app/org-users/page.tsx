"use client";

import { useState } from "react";
import BookPageShell from "@/components/ui/BookPageShell";
import UserSection from "@/components/system/UserSection";
import StandardFeaturesSection from "@/components/system/StandardFeaturesSection";
import OrgBookInfoSection from "@/components/org/OrgBookInfoSection";
import NotificationStatsPanel from "@/components/notifications/NotificationStatsPanel";
import { useOrgAdminAccess } from "@/hooks/useOrgAdminAccess";
import { useAuthStore } from "@/store/authStore";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type Tab = "users" | "features" | "book";

export default function OrgUsersPage() {
  const { ready } = useOrgAdminAccess();
  const organizationId = useAuthStore(
    (state) => state.user?.organizationId ?? null,
  );
  const [tab, setTab] = useState<Tab>("users");

  if (!ready) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}
      >
        {UI.LOADING}
      </div>
    );
  }

  return (
    <BookPageShell title={UI.ORG_USERS_TITLE} subtitle={UI.ORG_USERS_SUBTITLE}>
      <div className="mb-4 flex gap-2">
        <TabButton
          active={tab === "users"}
          onClick={() => setTab("users")}
          label={UI.ORG_TAB_USERS}
        />
        <TabButton
          active={tab === "features"}
          onClick={() => setTab("features")}
          label={UI.ORG_TAB_FEATURES}
        />
        <TabButton
          active={tab === "book"}
          onClick={() => setTab("book")}
          label={UI.ORG_TAB_BOOK}
        />
      </div>
      {tab === "users" ? (
        <div className="space-y-6">
          <NotificationStatsPanel />
          <UserSection mode="org" />
        </div>
      ) : tab === "features" ? (
        organizationId != null ? (
          <StandardFeaturesSection mode="org" organizationId={organizationId} />
        ) : (
          <p className={`text-sm ${BT.mutedOnDark}`}>
            {UI.SYSTEM_USER_ORG_REQUIRED}
          </p>
        )
      ) : (
        <OrgBookInfoSection />
      )}
    </BookPageShell>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? BT.pillActive : BT.pillIdle}
    >
      {label}
    </button>
  );
}
