"use client";

import type { ReactNode } from "react";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import SystemSubpageHero from "@/components/system/SystemSubpageHero";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { UI } from "@/lib/constants/ui-strings";

type SystemSubpageShellProps = {
  layoutTitle: string;
  backHref?: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function SystemSubpageShell({
  layoutTitle,
  backHref = "/system",
  eyebrow = UI.SYSTEM_PAGE_EYEBROW,
  title,
  subtitle,
  children,
}: SystemSubpageShellProps) {
  const { ready } = useSystemAccess();

  if (!ready) {
    return <AuthPageLoading message={UI.SYSTEM_LOADING} />;
  }

  return (
    <>
      <ResponsiveAppPageLayout title={layoutTitle} backHref={backHref}>
        <div className="mx-auto max-w-[1280px] pb-6">
          <SystemSubpageHero
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
          />
          {children}
        </div>
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );
}
