"use client";

import { useState } from "react";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import OrgBookInfoSection from "@/components/org/OrgBookInfoSection";
import OrgUsersPageHero from "@/components/org/OrgUsersPageHero";
import OrgUsersTabBar from "@/components/org/OrgUsersTabBar";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import StandardFeaturesSection from "@/components/system/StandardFeaturesSection";
import UserSection from "@/components/system/UserSection";
import NotificationStatsPanel from "@/components/notifications/NotificationStatsPanel";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useOrgAdminAccess } from "@/hooks/useOrgAdminAccess";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";

type Tab = "users" | "features" | "book";

const TABS: { id: Tab; label: string }[] = [
  { id: "users", label: UI.ORG_TAB_USERS },
  { id: "features", label: UI.ORG_TAB_FEATURES },
  { id: "book", label: UI.ORG_TAB_BOOK },
];

export default function OrgUsersPageView() {
  const { ready } = useOrgAdminAccess();
  const organizationId = useAuthStore(
    (state) => state.user?.organizationId ?? null,
  );
  const [tab, setTab] = useState<Tab>("users");

  if (!ready) {
    return <AuthPageLoading message={UI.ORG_USERS_LOADING} />;
  }

  return (
    <>
      <ResponsiveAppPageLayout title={UI.ORG_USERS_OPEN} backHref="/account">
        <div className="mx-auto max-w-[1280px] pb-6">
          <OrgUsersPageHero />
          <OrgUsersTabBar tabs={TABS} active={tab} onChange={setTab} />

          {tab === "users" ? (
            <div className="space-y-6">
              <NotificationStatsPanel variant="landing" />
              <UserSection mode="org" variant="landing" />
            </div>
          ) : null}

          {tab === "features" ? (
            organizationId != null ? (
              <StandardFeaturesSection
                mode="org"
                organizationId={organizationId}
                variant="landing"
              />
            ) : (
              <p className="rounded-xl border border-[#d4c3c1] bg-white p-6 text-sm text-[#504443] shadow-sm">
                {UI.SYSTEM_USER_ORG_REQUIRED}
              </p>
            )
          ) : null}

          {tab === "book" ? <OrgBookInfoSection variant="landing" /> : null}
        </div>
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );
}
