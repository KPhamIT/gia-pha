"use client";

import { AC } from "@/components/auth/account-theme";
import { MenuRow } from "@/components/auth/AccountRows";
import { UI } from "@/lib/constants/ui-strings";

export default function SystemQuickLinks() {
  return (
    <section className={`${AC.card} overflow-hidden`}>
      <h2 className="border-b border-[#d4c3c1] px-5 py-4 font-serif text-lg font-semibold text-[#321716]">
        {UI.SYSTEM_QUICK_LINKS}
      </h2>
      <div className="space-y-1 p-2">
        <MenuRow
          href="/system/admins"
          icon="userPlus"
          label={UI.SYSTEM_ADMINS_OPEN}
        />
        <MenuRow href="/system/blog" icon="book" label={UI.BLOG_ADMIN_TAB} />
        <MenuRow
          href="/system/billing"
          icon="list"
          label={UI.BILLING_ADMIN_OPEN}
        />
      </div>
    </section>
  );
}
