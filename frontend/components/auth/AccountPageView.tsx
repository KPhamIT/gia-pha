"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import UserAccountContent from "@/components/auth/UserAccountContent";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

function AccountStatusPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#d4c3c1] bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-[#504443]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl border border-[#d4c3c1] px-4 py-2 text-sm font-semibold text-[#321716]"
        >
          {UI.RETRY}
        </button>
      ) : null}
    </div>
  );
}

export default function AccountPageView() {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setDataLoading(false);
      return;
    }

    let cancelled = false;
    setDataLoading(true);

    Promise.all([api.person.list(), api.relationship.list()])
      .then(([nextPersons, nextRelationships]) => {
        if (cancelled) return;
        setPersons(nextPersons);
        setRelationships(nextRelationships);
        setDataError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setDataError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, reloadKey]);

  if (!loaded) {
    return <AuthPageLoading message={UI.ACCOUNT_LOADING} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#fcf9f4] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-[#321716]">
            {UI.ACCOUNT_PAGE_TITLE}
          </h1>
          <p className="mt-3 text-sm text-[#504443]">{UI.ACCOUNT_NOT_LOGGED_IN}</p>
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
      <ResponsiveAppPageLayout title={UI.ACCOUNT_TITLE} backHref="/">
        {dataLoading ? (
          <p className="text-sm text-[#504443]">{UI.ACCOUNT_LOADING}</p>
        ) : dataError ? (
          <AccountStatusPanel
            message={dataError}
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        ) : (
          <UserAccountContent persons={persons} relationships={relationships} />
        )}
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );
}
