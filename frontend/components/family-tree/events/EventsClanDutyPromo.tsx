"use client";

import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

export default function EventsClanDutyPromo() {
  return (
    <div className="rounded-xl border border-[#d4c3c1] bg-white p-5 shadow-sm md:p-6">
      <h3 className="font-serif text-xl font-semibold text-[#321716]">
        {UI.CLAN_DUTY_PROMO_TITLE}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#504443]">
        {UI.CLAN_DUTY_PROMO_DESC}
      </p>
      <Link
        href="/events/bien-ho"
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#944a00]/40 bg-[#ffdcc5]/50 py-3 text-sm font-bold text-[#663100] transition hover:bg-[#ffdcc5]"
      >
        {UI.CLAN_DUTY_PROMO_CTA}
      </Link>
    </div>
  );
}
