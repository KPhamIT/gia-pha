"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import CeremonyHeritageExperience from "@/components/ceremonies/CeremonyHeritageExperience";
import UpcomingCeremoniesList from "@/components/notifications/UpcomingCeremoniesList";
import UpcomingCeremoniesPageHero from "@/components/ceremonies/UpcomingCeremoniesPageHero";
import UpcomingCeremoniesQuickLinks from "@/components/ceremonies/UpcomingCeremoniesQuickLinks";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";

export default function UpcomingCeremoniesPageView() {
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
    return <AuthPageLoading message={UI.CEREMONIES_UPCOMING_LOADING} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#fcf9f4] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-[#321716]">
            {UI.CEREMONIES_UPCOMING_TITLE}
          </h1>
          <p className="mt-3 text-sm text-[#504443]">{UI.NOTIF_LOGIN_REQUIRED}</p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white"
          >
            {UI.LOGIN_BUTTON}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ResponsiveAppPageLayout
        title={UI.CEREMONIES_UPCOMING_TITLE}
        backHref="/account"
      >
        <div className="mx-auto max-w-[1280px] pb-6">
          <UpcomingCeremoniesPageHero />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <UpcomingCeremoniesList
                variant="landing"
                highlightPersonId={highlightPersonId}
              />
            </div>
            <aside className="lg:col-span-4">
              <UpcomingCeremoniesQuickLinks />
            </aside>
          </div>
        </div>
      </ResponsiveAppPageLayout>

      {showCeremony ? (
        <CeremonyHeritageExperience
          personId={personId}
          persons={persons}
          relationships={relationships}
          onClose={handleCloseCeremony}
        />
      ) : null}

      <AuthRequiredSheet />
    </>
  );
}
