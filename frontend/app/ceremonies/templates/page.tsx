"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookPageShell from "@/components/ui/BookPageShell";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import CeremonyTemplatesManager from "@/components/ceremonies/CeremonyTemplatesManager";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function CeremonyTemplatesPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <CeremonyTemplatesPageContent />
    </Suspense>
  );
}

function CeremonyTemplatesPageContent() {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const demoMode = useSearchParams().get("demo") === "1";

  if (demoMode) {
    return (
      <BookPageShell
        title={UI.CEREMONY_TEMPLATES_TITLE}
        subtitle={UI.LANDING_DEMO_HINT}
        backHref="/"
      >
        <CeremonyTemplatesManager demo />
      </BookPageShell>
    );
  }

  if (!loaded) {
    return <AuthPageLoading />;
  }

  if (!isLoggedIn) {
    return (
      <BookPageShell
        title={UI.CEREMONY_TEMPLATES_TITLE}
        subtitle={UI.CEREMONY_TEMPLATES_SUBTITLE}
      >
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.NOTIF_LOGIN_REQUIRED}</p>
        <Link
          href="/login"
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mt-4 inline-flex`}
        >
          {UI.LOGIN_BUTTON}
        </Link>
      </BookPageShell>
    );
  }

  return (
    <BookPageShell
      title={UI.CEREMONY_TEMPLATES_TITLE}
      subtitle={UI.CEREMONY_TEMPLATES_SUBTITLE}
    >
      <CeremonyTemplatesManager />
    </BookPageShell>
  );
}
