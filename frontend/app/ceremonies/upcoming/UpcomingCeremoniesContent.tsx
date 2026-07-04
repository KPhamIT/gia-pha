"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BookPageShell from "@/components/ui/BookPageShell";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import UpcomingCeremoniesList from "@/components/notifications/UpcomingCeremoniesList";
import CeremonyHeritageExperience from "@/components/ceremonies/CeremonyHeritageExperience";
import { api } from "@/lib/api";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";

export default function UpcomingCeremoniesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personIdParam = searchParams.get("personId");
  const viewCeremony = searchParams.get("view") === "ceremony";
  const personId = personIdParam ? Number(personIdParam) : null;

  const { loaded, isLoggedIn } = useAuthBootstrap();
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  useEffect(() => {
    if (!isLoggedIn) return;
    void Promise.all([api.person.list(), api.relationship.list()]).then(
      ([p, r]) => {
        setPersons(p);
        setRelationships(r);
      },
    );
  }, [isLoggedIn]);

  const showCeremony =
    viewCeremony && personId != null && !Number.isNaN(personId);

  const handleCloseCeremony = useCallback(() => {
    router.push("/ceremonies/upcoming");
  }, [router]);

  const highlightPersonId = useMemo(() => {
    const raw = searchParams.get("personId");
    return raw ? Number(raw) : null;
  }, [searchParams]);

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

  return (
    <>
      <BookPageShell
        title={UI.CEREMONIES_UPCOMING_TITLE}
        subtitle={UI.CEREMONIES_UPCOMING_SUBTITLE}
        backHref="/book"
      >
        <UpcomingCeremoniesList highlightPersonId={highlightPersonId} />
      </BookPageShell>

      {showCeremony ? (
        <CeremonyHeritageExperience
          personId={personId}
          persons={persons}
          relationships={relationships}
          onClose={handleCloseCeremony}
        />
      ) : null}
    </>
  );
}
