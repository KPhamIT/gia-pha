"use client";

import { AC } from "@/components/auth/account-theme";
import { MenuRow } from "@/components/auth/AccountRows";
import { UI } from "@/lib/constants/ui-strings";

export default function UpcomingCeremoniesQuickLinks() {
  return (
    <section className={`${AC.card} overflow-hidden`}>
      <h2 className="border-b border-[#d4c3c1] px-5 py-4 font-serif text-lg font-semibold text-[#321716]">
        {UI.CEREMONIES_UPCOMING_QUICK_LINKS}
      </h2>
      <div className="space-y-1 p-2">
        <MenuRow
          href="/ceremonies/templates"
          icon="book"
          label={UI.CEREMONY_TEMPLATES_OPEN}
        />
        <MenuRow
          href="/settings/notifications"
          icon="settings"
          label={UI.NOTIF_OPEN_SETTINGS}
        />
        <MenuRow
          href="/notifications"
          icon="list"
          label={UI.NOTIF_OPEN_CENTER}
        />
      </div>
    </section>
  );
}
