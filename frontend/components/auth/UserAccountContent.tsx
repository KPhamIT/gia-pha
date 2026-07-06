"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import Icon from "@/components/icons/Icon";
import AccountPageHero from "@/components/auth/AccountPageHero";
import { UI } from "@/lib/constants/ui-strings";
import { api } from "@/lib/api";
import { logout } from "@/lib/auth/session";
import { notify } from "@/lib/notify";
import { useAuthStore } from "@/store/authStore";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { getErrorMessage } from "@/utils/errors";
import ContactInfoPanel from "@/components/auth/ContactInfoPanel";
import NotificationStatsPanel from "@/components/notifications/NotificationStatsPanel";
import AccountLinkSection from "./AccountLinkSection";
import AccountQuickActions from "./AccountQuickActions";
import OrgShareLinkSection from "./OrgShareLinkSection";
import { InfoRow } from "./AccountRows";
import { AC } from "./account-theme";

type UserAccountContentProps = {
  persons: Person[];
  relationships: Relationship[];
  onLinked?: () => void;
};

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
  local: UI.ACCOUNT_PROVIDER_LOCAL,
  credentials: UI.ACCOUNT_PROVIDER_LOCAL,
};

function roleBadgeClass(isSystem: boolean, isAdmin: boolean): string {
  if (isSystem) return "bg-[#ffdad6] text-[#93000a]";
  if (isAdmin) return "bg-[#ffdcc5] text-[#301400]";
  return "bg-[#f0ede9] text-[#504443]";
}

export default function UserAccountContent({
  persons,
  relationships,
  onLinked,
}: UserAccountContentProps) {
  const user = useAuthStore((state) => state.user);
  const person = useAuthStore((state) => state.person);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isSystem = useAuthStore((state) => state.isSystem);
  const canUseFeature = useAuthStore((state) => state.canUseFeature);
  const { requireFeature } = useFeatureAccess();
  const refresh = useAuthStore((state) => state.refresh);
  const [personId, setPersonId] = useState<number | null>(person?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const linkedId = person?.id ?? null;
  const [prevLinkedId, setPrevLinkedId] = useState(linkedId);
  if (linkedId !== prevLinkedId) {
    setPrevLinkedId(linkedId);
    setPersonId(linkedId);
  }

  const handleSaveLink = useCallback(async () => {
    if (!requireFeature("linkAccount")) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.auth.linkPerson(personId);
      await refresh();
      setMessage(UI.ACCOUNT_LINK_SAVED);
      notify.success(UI.TOAST_LINK_SAVED);
      onLinked?.();
    } catch (err) {
      const nextMessage = getErrorMessage(err, UI.ERR_FETCH_DATA);
      setError(nextMessage);
      notify.error(err, UI.ERR_FETCH_DATA);
    } finally {
      setSaving(false);
    }
  }, [onLinked, personId, refresh, requireFeature]);

  if (!user) {
    return (
      <div className="rounded-xl border border-[#d4c3c1] bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-[#504443]">{UI.ACCOUNT_NOT_LOGGED_IN}</p>
        <Link
          href="/login"
          className="mt-4 inline-flex rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white"
        >
          {UI.BTN_LOGIN}
        </Link>
      </div>
    );
  }

  const roleLabel = isSystem
    ? UI.ACCOUNT_ROLE_SYSTEM
    : isAdmin
      ? UI.ACCOUNT_ROLE_ADMIN
      : UI.ACCOUNT_ROLE_STANDARD;

  const displayName = user.username || user.email || person?.fullName || "—";
  const initial = (person?.fullName || user.username || user.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();
  const providerLabel = PROVIDER_LABELS[user.provider] ?? user.provider;
  const orgName = user.organization?.name ?? null;
  const branchLabel =
    person?.branch != null ? `Chi ${person.branch}` : null;
  const profileSubtitle = [roleLabel, branchLabel, orgName]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto max-w-[1280px] pb-6">
      <AccountPageHero />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section className={`${AC.card} p-5 md:p-6`}>
            <div className="flex items-center gap-4 border-b border-[#d4c3c1]/60 pb-5">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-[#944a00] bg-[#ffdcc5] text-2xl font-semibold text-[#301400]">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-xl font-semibold text-[#321716]">
                  {displayName}
                </p>
                <p className="mt-1 text-sm text-[#504443]">{profileSubtitle}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${roleBadgeClass(isSystem, isAdmin)}`}
                >
                  {roleLabel}
                </span>
              </div>
            </div>

            <dl className="mt-4 divide-y divide-[#d4c3c1]/40">
              {user.email ? (
                <InfoRow label={UI.ACCOUNT_EMAIL} value={user.email} />
              ) : null}
              <InfoRow label={UI.ACCOUNT_PROVIDER} value={providerLabel} />
              {orgName ? <InfoRow label={UI.ACCOUNT_ORG} value={orgName} /> : null}
              <InfoRow
                label={UI.ACCOUNT_LINKED_MEMBER}
                value={person?.fullName ?? UI.ACCOUNT_NOT_LINKED}
                muted={!person?.fullName}
              />
            </dl>
          </section>

          {canUseFeature("linkAccount") ? (
            <AccountLinkSection
              persons={persons}
              relationships={relationships}
              personId={personId}
              onSelectPerson={setPersonId}
              saving={saving}
              message={message}
              error={error}
              onSave={() => void handleSaveLink()}
            />
          ) : null}

          <OrgShareLinkSection />
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <AccountQuickActions isAdmin={isAdmin} isSystem={isSystem} />

          {isAdmin ? <NotificationStatsPanel variant="landing" /> : null}

          {!isAdmin && !isSystem ? (
            <ContactInfoPanel variant="landing" />
          ) : null}

          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#ffdad6] bg-white px-4 py-3 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]/30 active:scale-[0.99]"
          >
            <Icon
              path="arrowLeft"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
            {UI.ACCOUNT_LOGOUT}
          </button>
        </aside>
      </div>
    </div>
  );
}
