"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BookPageShell from "@/components/ui/BookPageShell";
import FamilyTreeStatus from "@/components/family-tree/graph/FamilyTreeStatus";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import NotificationOptInBanner from "@/components/notifications/NotificationOptInBanner";
import { api } from "@/lib/api";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

const EventsManager = dynamic(
  () => import("@/components/family-tree/events/EventsManager"),
  { ssr: false },
);

export default function EventsPage() {
  const { theme } = useTheme();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.person.list(), api.relationship.list()])
      .then(([nextPersons, nextRelationships]) => {
        if (cancelled) return;
        setPersons(nextPersons);
        setRelationships(nextRelationships);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }

  if (error) {
    return <FamilyTreeStatus theme={theme} type="error" message={error} />;
  }

  return (
    <>
      <NotificationOptInBanner />

      <BookPageShell title={UI.EVENTS_TITLE} subtitle={UI.EVENTS_SUBTITLE}>
        <EventsManager
          persons={persons}
          relationships={relationships}
          standalone
        />
      </BookPageShell>

      <AuthRequiredSheet />
    </>
  );
}
