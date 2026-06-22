import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { MenuRow } from "./AccountRows";

/** "Truy cập nhanh" — quick links (admin-only rows gated by `isAdmin`). */
export default function AccountQuickActions({ isAdmin }: { isAdmin: boolean }) {
  return (
    <section className={`overflow-hidden ${BT.card}`}>
      <h2 className="border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900">
        {UI.ACCOUNT_QUICK_ACTIONS}
      </h2>
      <div className="divide-y divide-amber-200/60">
        {isAdmin ? (
          <MenuRow href="/org-users" icon="userPlus" label={UI.BTN_USERS} />
        ) : null}
        {isAdmin ? (
          <MenuRow
            href="/ceremonies/templates"
            icon="book"
            label={UI.CEREMONY_TEMPLATES_OPEN}
          />
        ) : null}
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
