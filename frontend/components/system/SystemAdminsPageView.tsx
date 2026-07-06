"use client";

import SystemSubpageShell from "@/components/system/SystemSubpageShell";
import UserSection from "@/components/system/UserSection";
import { UI } from "@/lib/constants/ui-strings";

export default function SystemAdminsPageView() {
  return (
    <SystemSubpageShell
      layoutTitle={UI.SYSTEM_ADMINS_OPEN}
      title={UI.SYSTEM_ADMINS_TITLE}
      subtitle={UI.SYSTEM_ADMINS_SUBTITLE}
    >
      <UserSection
        mode="system"
        variant="landing"
        roleFilter="ADMIN"
        showOrgCreate
      />
    </SystemSubpageShell>
  );
}
