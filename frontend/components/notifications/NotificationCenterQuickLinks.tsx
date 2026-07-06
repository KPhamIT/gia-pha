"use client";

import { AC } from "@/components/auth/account-theme";
import { MenuRow } from "@/components/auth/AccountRows";
import { UI } from "@/lib/constants/ui-strings";

export default function NotificationCenterQuickLinks() {
  return (
    <section className={`${AC.card} overflow-hidden`}>
      <h2 className="border-b border-[#d4c3c1] px-5 py-4 font-serif text-lg font-semibold text-[#321716]">
        {UI.NOTIFICATIONS_CENTER_QUICK_LINKS}
      </h2>
      <div className="space-y-1 p-2">
        <MenuRow
          href="/settings/notifications"
          icon="settings"
          label={UI.NOTIF_OPEN_SETTINGS}
        />
        <MenuRow
          href="/ceremonies/upcoming"
          icon="calendar"
          label={UI.NOTIF_OPEN_UPCOMING}
        />
      </div>
      <div className="border-t border-[#d4c3c1] px-5 py-4">
        <p className="text-xs leading-relaxed text-[#504443]">
          {UI.NOTIF_IN_APP_HINT}
        </p>
      </div>
    </section>
  );
}
