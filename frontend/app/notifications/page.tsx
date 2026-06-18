'use client';

import BookPageShell from '@/components/ui/BookPageShell';
import AuthPageLoading from '@/components/ui/AuthPageLoading';
import NotificationCenterList from '@/components/notifications/NotificationCenterList';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import Link from 'next/link';

export default function NotificationsPage() {
  const { loaded, isLoggedIn } = useAuthBootstrap();

  if (!loaded) {
    return <AuthPageLoading />;
  }

  if (!isLoggedIn) {
    return (
      <BookPageShell title={UI.NOTIFICATIONS_TITLE} subtitle={UI.NOTIFICATIONS_SUBTITLE}>
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.NOTIF_LOGIN_REQUIRED}</p>
        <Link href="/login" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mt-4 inline-flex`}>
          {UI.LOGIN_BUTTON}
        </Link>
      </BookPageShell>
    );
  }

  return (
    <BookPageShell title={UI.NOTIFICATIONS_TITLE} subtitle={UI.NOTIFICATIONS_SUBTITLE}>
      <div className="mb-4">
        <Link href="/settings/notifications" className={BT.btnGhost}>
          {UI.NOTIF_OPEN_SETTINGS}
        </Link>
      </div>
      <NotificationCenterList />
    </BookPageShell>
  );
}
