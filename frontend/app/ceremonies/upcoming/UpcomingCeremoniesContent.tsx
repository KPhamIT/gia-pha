"use client";

import { useSearchParams } from "next/navigation";
import BookPageShell from "@/components/ui/BookPageShell";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import UpcomingCeremoniesList from "@/components/notifications/UpcomingCeremoniesList";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import Link from "next/link";

export default function UpcomingCeremoniesPageContent() {
  const searchParams = useSearchParams();
  const personIdParam = searchParams.get("personId");
  const viewCeremony = searchParams.get("view") === "ceremony";
  const personId = personIdParam ? Number(personIdParam) : null;

  const { loaded, isLoggedIn } = useAuthBootstrap();

  if (!loaded) {
    return <AuthPageLoading />;
  }

  if (!isLoggedIn) {
    return (
      <BookPageShell
        title={UI.CEREMONIES_UPCOMING_TITLE}
        subtitle={UI.CEREMONIES_UPCOMING_SUBTITLE}
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

  const showCeremony =
    viewCeremony && personId != null && !Number.isNaN(personId);

  return (
    <BookPageShell
      title={showCeremony ? UI.CEREMONY_TITLE : UI.CEREMONIES_UPCOMING_TITLE}
      subtitle={showCeremony ? undefined : UI.CEREMONIES_UPCOMING_SUBTITLE}
      backHref={showCeremony ? "/ceremonies/upcoming" : "/book"}
    >
      {showCeremony ? (
        <CeremonyViewer personId={personId} />
      ) : (
        <UpcomingCeremoniesList highlightPersonId={personId} />
      )}
    </BookPageShell>
  );
}
