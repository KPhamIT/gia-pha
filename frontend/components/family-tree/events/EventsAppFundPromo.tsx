"use client";

import { UI } from "@/lib/constants/ui-strings";

export type AppFundPromoMode = "donate" | "donors";

type Props = {
  onOpen: (mode: AppFundPromoMode) => void;
  disabled?: boolean;
};

export default function EventsAppFundPromo({ onOpen, disabled }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#1c1917] p-6 text-white shadow-xl">
      <div className="absolute -left-8 -bottom-8 h-36 w-36 rounded-full bg-[#fc8f34]/15 blur-3xl" />
      <h3 className="relative z-10 font-serif text-xl font-semibold">
        {UI.EVENTS_APP_FUND_PROMO_TITLE}
      </h3>
      <p className="relative z-10 mt-2 text-base text-white/80">
        {UI.EVENTS_APP_FUND_PROMO_DESC}
      </p>
      <div className="relative z-10 mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => onOpen("donate")}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-full bg-[#fc8f34] px-2 py-3 text-sm font-bold text-[#663100] shadow-lg transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {UI.EVENTS_APP_FUND_PROMO_CTA}
        </button>
        <button
          type="button"
          onClick={() => onOpen("donors")}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-full border border-white/35 bg-white/10 px-2 py-3 text-sm font-bold text-white transition hover:bg-white/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {UI.EVENTS_APP_FUND_PROMO_VIEW}
        </button>
      </div>
    </div>
  );
}
