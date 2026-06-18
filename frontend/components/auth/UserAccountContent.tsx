'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import type { IconName } from '@/components/icons/icon-paths';
import Icon from '@/components/icons/Icon';
import PersonSearchPanel from '@/components/family-tree/person/PersonSearchPanel';
import { UI } from '@/lib/constants/ui-strings';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { BT } from '@/lib/constants/ui-theme';
import { api } from '@/lib/api';
import { logout } from '@/lib/auth/session';
import { notify } from '@/lib/notify';
import { useAuthStore } from '@/store/authStore';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { getErrorMessage } from '@/utils/errors';
import ContactInfoPanel from '@/components/auth/ContactInfoPanel';
import NotificationStatsPanel from '@/components/notifications/NotificationStatsPanel';

type UserAccountContentProps = {
  persons: Person[];
  relationships: Relationship[];
  onLinked?: () => void;
};

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  local: 'Tài khoản nội bộ',
  credentials: 'Tài khoản nội bộ',
};

export default function UserAccountContent({ persons, relationships, onLinked }: UserAccountContentProps) {
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

  useEffect(() => {
    setPersonId(person?.id ?? null);
  }, [person?.id]);

  const handleSaveLink = useCallback(async () => {
    if (!requireFeature('linkAccount')) return;
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
      const message = getErrorMessage(err, UI.ERR_FETCH_DATA);
      setError(message);
      notify.error(err, UI.ERR_FETCH_DATA);
    } finally {
      setSaving(false);
    }
  }, [onLinked, personId, refresh, requireFeature]);

  if (!user) {
    return (
      <div className="space-y-4">
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.ACCOUNT_NOT_LOGGED_IN}</p>
        <Link href="/login" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} inline-flex`}>
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
  const roleBadgeClass = isSystem
    ? 'bg-red-100 text-red-700'
    : isAdmin
      ? 'bg-amber-100 text-amber-800'
      : 'bg-neutral-100 text-neutral-600';

  const displayName = user.username || user.email || person?.fullName || '—';
  const initial = (person?.fullName || user.username || user.email || '?').trim().charAt(0).toUpperCase();
  const providerLabel = PROVIDER_LABELS[user.provider] ?? user.provider;
  const orgName = user.organization?.name ?? null;

  return (
    <div className="space-y-5">
      {/* Hồ sơ */}
      <section className={`${BT.card} p-4`}>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-amber-100 text-2xl font-semibold text-amber-800">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-neutral-900">{displayName}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeClass}`}>
              {roleLabel}
            </span>
          </div>
        </div>

        <dl className="mt-4 divide-y divide-amber-200/60 text-sm">
          {user.email ? <InfoRow label="Email" value={user.email} /> : null}
          <InfoRow label={UI.ACCOUNT_PROVIDER} value={providerLabel} />
          {orgName ? <InfoRow label={UI.ACCOUNT_ORG} value={orgName} /> : null}
          <InfoRow
            label={UI.ACCOUNT_LINKED_MEMBER}
            value={person?.fullName ?? UI.ACCOUNT_NOT_LINKED}
            muted={!person?.fullName}
          />
        </dl>
      </section>

      {/* Liên kết thành viên */}
      {canUseFeature('linkAccount') ? (
        <section className={`${BT.card} space-y-3 p-4`}>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">{UI.ACCOUNT_LINK_PERSON}</h2>
            <p className={`mt-1 text-xs ${BT.mutedOnLight}`}>{UI.ACCOUNT_LINK_PERSON_HINT}</p>
          </div>
          <PersonSearchPanel
            persons={persons}
            relationships={relationships}
            selectedPersonId={personId}
            onSelect={(item) => setPersonId(item.id)}
            onClear={() => setPersonId(null)}
            clearLabel={UI.ACCOUNT_CLEAR_LINK}
            listClassName="max-h-52 overflow-y-auto rounded-xl border border-amber-100 bg-amber-50/30 px-1 py-1"
          />
          <div className="flex justify-end">
            <IconRoundButton
              icon="save"
              variant="gold"
              loading={saving}
              label={UI.SAVE}
              onClick={() => void handleSaveLink()}
            />
          </div>
          {message ? <p className={`text-sm font-medium ${BT.gold}`}>{message}</p> : null}
          {error ? <p className={BT.errorBgLight}>{error}</p> : null}
        </section>
      ) : null}

      {/* Truy cập nhanh */}
      <section className={`overflow-hidden ${BT.card}`}>
        <h2 className={`border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900`}>
          {UI.ACCOUNT_QUICK_ACTIONS}
        </h2>
        <div className="divide-y divide-amber-200/60">
          {isAdmin ? <MenuRow href="/org-users" icon="userPlus" label={UI.BTN_USERS} /> : null}
          {isAdmin ? <MenuRow href="/ceremonies/templates" icon="book" label={UI.CEREMONY_TEMPLATES_OPEN} /> : null}
          <MenuRow href="/settings/notifications" icon="settings" label={UI.NOTIF_OPEN_SETTINGS} />
          <MenuRow href="/ceremonies/upcoming" icon="calendar" label={UI.NOTIF_OPEN_UPCOMING} />
        </div>
      </section>

      {isAdmin ? <NotificationStatsPanel /> : null}

      {!isAdmin && !isSystem ? <ContactInfoPanel /> : null}

      <button
        type="button"
        onClick={() => logout()}
        className={`${BT.btnBase} ${BT.btnSm} ${BT.btnDanger} w-full`}
      >
        <Icon path="arrowLeft" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        {UI.ACCOUNT_LOGOUT}
      </button>
    </div>
  );
}

function InfoRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className={BT.mutedOnLight}>{label}</dt>
      <dd className={`min-w-0 truncate text-right font-medium ${muted ? 'text-neutral-400' : 'text-neutral-900'}`}>
        {value}
      </dd>
    </div>
  );
}

function MenuRow({ href, icon, label }: { href: string; icon: IconName; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-amber-50 md:hover:bg-amber-50"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800">
        <Icon path={icon} size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">{label}</span>
      <Icon path="chevronRight" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} className="shrink-0 text-neutral-400" />
    </Link>
  );
}
