"use client";

import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import CeremonyTemplatesManager from "@/components/ceremonies/CeremonyTemplatesManager";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function CeremonyTemplatesPage() {
  const { loaded, isLoggedIn } = useAuthBootstrap();

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
