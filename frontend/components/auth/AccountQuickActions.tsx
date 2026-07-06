import { UI } from "@/lib/constants/ui-strings";
import { AC } from "./account-theme";
import { MenuRow } from "./AccountRows";

export default function AccountQuickActions({
  isAdmin,
  isSystem = false,
}: {
  isAdmin: boolean;
  isSystem?: boolean;
}) {
  return (
    <section className={`${AC.card} overflow-hidden`}>
      <h2 className="border-b border-[#d4c3c1] px-5 py-4 font-serif text-lg font-semibold text-[#321716]">
        {UI.ACCOUNT_QUICK_ACTIONS}
      </h2>
      <div className="space-y-1 p-2">
        {isSystem ? (
          <MenuRow href="/system" icon="settings" label={UI.SYSTEM_OPEN} />
        ) : null}
        {isSystem ? (
          <MenuRow
            href="/system/admins"
            icon="userPlus"
            label={UI.SYSTEM_ADMINS_OPEN}
          />
        ) : null}
        {isAdmin ? (
          <MenuRow href="/org-users" icon="userPlus" label={UI.BTN_USERS} />
        ) : null}
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
          href="/ceremonies/upcoming"
          icon="calendar"
          label={UI.NOTIF_OPEN_UPCOMING}
        />
      </div>
    </section>
  );
}
