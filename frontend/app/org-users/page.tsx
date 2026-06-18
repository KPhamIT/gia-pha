'use client';

import { useState } from 'react';
import BookPageShell from '@/components/ui/BookPageShell';
import UserSection from '@/components/system/UserSection';
import StandardFeaturesSection from '@/components/system/StandardFeaturesSection';
import NotificationStatsPanel from '@/components/notifications/NotificationStatsPanel';
import { useOrgAdminAccess } from '@/hooks/useOrgAdminAccess';
import { useAuthStore } from '@/store/authStore';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';

type Tab = 'users' | 'features';

export default function OrgUsersPage() {
  const { ready } = useOrgAdminAccess();
  const organizationId = useAuthStore((state) => state.user?.organizationId ?? null);
  const [tab, setTab] = useState<Tab>('users');

  if (!ready) {
    return (
      <div className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}>
        {UI.LOADING}
      </div>
    );
  }

  return (
    <BookPageShell title={UI.ORG_USERS_TITLE} subtitle={UI.ORG_USERS_SUBTITLE}>
      <div className="mb-4 flex gap-2">
        <TabButton active={tab === 'users'} onClick={() => setTab('users')} label={UI.ORG_TAB_USERS} />
        <TabButton active={tab === 'features'} onClick={() => setTab('features')} label={UI.ORG_TAB_FEATURES} />
      </div>
      {tab === 'users' ? (
        <div className="space-y-6">
          <NotificationStatsPanel />
          <UserSection mode="org" />
        </div>
      ) : organizationId != null ? (
        <StandardFeaturesSection mode="org" organizationId={organizationId} />
      ) : (
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.SYSTEM_USER_ORG_REQUIRED}</p>
      )}
      {tab === 'users' ? (
        <div className="mt-6">
          <a href="/ceremonies/templates" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} inline-flex`}>
            {UI.CEREMONY_TEMPLATES_OPEN}
          </a>
        </div>
      ) : null}
    </BookPageShell>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick} className={active ? BT.pillActive : BT.pillIdle}>
      {label}
    </button>
  );
}
