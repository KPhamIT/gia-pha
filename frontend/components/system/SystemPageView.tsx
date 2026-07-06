"use client";

import { useState } from "react";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import OrgUsersTabBar from "@/components/org/OrgUsersTabBar";
import OrganizationSection from "@/components/system/OrganizationSection";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import SystemFeaturesSection from "@/components/system/SystemFeaturesSection";
import SystemPageHero from "@/components/system/SystemPageHero";
import SystemQuickLinks from "@/components/system/SystemQuickLinks";
import UserSection from "@/components/system/UserSection";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { UI } from "@/lib/constants/ui-strings";

type Tab = "orgs" | "users" | "features";

const TABS: { id: Tab; label: string }[] = [
  { id: "orgs", label: UI.SYSTEM_TAB_ORGS },
  { id: "users", label: UI.SYSTEM_TAB_USERS },
  { id: "features", label: UI.SYSTEM_TAB_FEATURES },
];

export default function SystemPageView() {
  const { ready } = useSystemAccess();
  const [tab, setTab] = useState<Tab>("orgs");

  if (!ready) {
    return <AuthPageLoading message={UI.SYSTEM_LOADING} />;
  }

  return (
    <>
      <ResponsiveAppPageLayout title={UI.SYSTEM_OPEN} backHref="/account">
        <div className="mx-auto max-w-[1280px] pb-6">
          <SystemPageHero />
          <OrgUsersTabBar tabs={TABS} active={tab} onChange={setTab} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {tab === "orgs" ? (
                <OrganizationSection variant="landing" />
              ) : null}
              {tab === "users" ? (
                <UserSection mode="system" variant="landing" />
              ) : null}
              {tab === "features" ? (
                <SystemFeaturesSection variant="landing" />
              ) : null}
            </div>
            <aside className="lg:col-span-4">
              <SystemQuickLinks />
            </aside>
          </div>
        </div>
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );
}
