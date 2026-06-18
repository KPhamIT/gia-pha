'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import UserAccountContent from '@/components/auth/UserAccountContent';
import BookPageShell from '@/components/ui/BookPageShell';
import AuthPageLoading from '@/components/ui/AuthPageLoading';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { api } from '@/lib/api';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import { getErrorMessage } from '@/utils/errors';

export default function AccountPage() {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    setDataLoading(true);
    setDataError(null);

    Promise.all([api.person.list(), api.relationship.list()])
      .then(([nextPersons, nextRelationships]) => {
        if (cancelled) return;
        setPersons(nextPersons);
        setRelationships(nextRelationships);
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
  }, [isLoggedIn]);

  if (!loaded) {
    return <AuthPageLoading />;
  }

  if (!isLoggedIn) {
    return (
      <BookPageShell title={UI.ACCOUNT_TITLE} subtitle={UI.ACCOUNT_SUBTITLE}>
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.ACCOUNT_NOT_LOGGED_IN}</p>
        <Link href="/login" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mt-4 inline-flex`}>
          {UI.LOGIN_BUTTON}
        </Link>
      </BookPageShell>
    );
  }

  return (
    <BookPageShell title={UI.ACCOUNT_TITLE} subtitle={UI.ACCOUNT_SUBTITLE}>
      {dataLoading ? <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p> : null}
      {dataError ? <p className={BT.errorBgLight}>{dataError}</p> : null}
      {!dataLoading ? (
        <UserAccountContent persons={persons} relationships={relationships} />
      ) : null}
    </BookPageShell>
  );
}
