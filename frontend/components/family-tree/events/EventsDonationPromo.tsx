"use client";

import { UI } from "@/lib/constants/ui-strings";

type Props = {
  onDonate: () => void;
  disabled?: boolean;
};

export default function EventsDonationPromo({ onDonate, disabled }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#451A03] p-6 text-white shadow-xl">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#944a00]/20 blur-3xl" />
      <h3 className="relative z-10 font-serif text-xl font-semibold">
        {UI.EVENTS_DONATION_PROMO_TITLE}
      </h3>
      <p className="relative z-10 mt-2 text-base text-white/80">
        {UI.EVENTS_DONATION_PROMO_DESC}
      </p>
      <button
        type="button"
        onClick={onDonate}
        disabled={disabled}
        className="relative z-10 mt-6 w-full rounded-full bg-[#fc8f34] py-3 text-sm font-bold text-[#663100] shadow-lg transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {UI.EVENTS_DONATION_PROMO_CTA}
      </button>
    </div>
  );
}
