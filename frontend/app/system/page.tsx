"use client";

import { useState } from "react";
import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import OrganizationSection from "@/components/system/OrganizationSection";
import UserSection from "@/components/system/UserSection";
import SystemFeaturesSection from "@/components/system/SystemFeaturesSection";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type Tab = "orgs" | "users" | "features";

export default function SystemPage() {
  const { ready } = useSystemAccess();
  const [tab, setTab] = useState<Tab>("orgs");

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
    <BookPageShell
      title={UI.SYSTEM_CONSOLE_TITLE}
      subtitle={UI.SYSTEM_CONSOLE_SUBTITLE}
    >
      <div className="mb-4 flex gap-2">
        <TabButton
          active={tab === "orgs"}
          onClick={() => setTab("orgs")}
          label={UI.SYSTEM_TAB_ORGS}
        />
        <TabButton
          active={tab === "users"}
          onClick={() => setTab("users")}
          label={UI.SYSTEM_TAB_USERS}
        />
        <TabButton
          active={tab === "features"}
          onClick={() => setTab("features")}
          label={UI.SYSTEM_TAB_FEATURES}
        />
      </div>
      {tab === "orgs" ? (
        <OrganizationSection />
      ) : tab === "users" ? (
        <div className="space-y-3">
          <Link
            href="/system/admins"
            className="inline-flex text-sm font-medium text-amber-800 underline-offset-2 hover:underline"
          >
            {UI.SYSTEM_ADMINS_OPEN} →
          </Link>
          <UserSection mode="system" />
        </div>
      ) : (
        <SystemFeaturesSection />
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
