"use client";

import { useState } from "react";
import Icon from "@/components/icons/Icon";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { shareCeremonyLink } from "@/utils/ceremony-share";

type Props = {
  scaleLabel: string;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  sharePersonId?: number;
  shareFullName?: string;
  shareUrl?: string;
  showShare?: boolean;
  onPrint: () => void;
};

export default function CeremonyHeritageActionBar({
  scaleLabel,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
  sharePersonId,
  shareFullName = "",
  shareUrl,
  showShare = true,
  onPrint,
}: Props) {
  const [shareBusy, setShareBusy] = useState(false);
  const canShare = showShare && (shareUrl != null || sharePersonId != null);

  const handleShare = async () => {
    if (!canShare) return;
    setShareBusy(true);
    try {
      const result = await shareCeremonyLink(
        shareFullName,
        sharePersonId ?? 0,
        shareUrl,
      );
      if (result === "shared") notify.success(UI.CEREMONY_SHARE_SUCCESS);
      else if (result === "copied") notify.success(UI.CEREMONY_SHARE_COPIED);
      else if (result !== "cancelled") notify.error(null, UI.CEREMONY_SHARE_FAILED);
    } finally {
      setShareBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div
          className="flex items-center gap-1 rounded-lg bg-black/20 p-1"
          role="group"
          aria-label={UI.CEREMONY_FONT_SIZE}
        >
          <button
            type="button"
            className="rounded-md px-4 py-1 text-sm font-bold transition hover:bg-white/10 active:bg-white/20 disabled:opacity-40"
            disabled={!canDecrease}
            aria-label={UI.CEREMONY_FONT_SIZE_DECREASE}
            onClick={onDecrease}
          >
            A−
          </button>
          <div className="h-4 w-px bg-white/20" />
          <span
            className="min-w-[3rem] px-3 text-center font-mono text-xs text-[#c5a059]"
            aria-live="polite"
          >
            {scaleLabel}
          </span>
          <div className="h-4 w-px bg-white/20" />
          <button
            type="button"
            className="rounded-md px-4 py-1 text-sm font-bold transition hover:bg-white/10 active:bg-white/20 disabled:opacity-40"
            disabled={!canIncrease}
            aria-label={UI.CEREMONY_FONT_SIZE_INCREASE}
            onClick={onIncrease}
          >
            A+
          </button>
        </div>
        <p className="hidden text-[10px] italic text-stone-400 sm:block">
          {UI.CEREMONY_SCROLL_HINT}
        </p>
      </div>

      <div className={`grid gap-3 ${showShare ? "grid-cols-2" : "grid-cols-1"}`}>
        {showShare ? (
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 py-2.5 text-sm font-medium transition hover:bg-white/20 active:scale-95 disabled:opacity-40"
            disabled={!canShare || shareBusy}
            onClick={() => void handleShare()}
          >
            <Icon
              path="share"
              size={16}
              fill="none"
              stroke="#c5a059"
              strokeWidth={2}
              pointer={false}
            />
            {UI.CEREMONY_SHARE}
          </button>
        ) : null}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a059] py-2.5 text-sm font-bold text-[#4a2c2a] shadow-lg transition hover:bg-[#c5a059]/90 active:scale-95"
          onClick={onPrint}
        >
          <Icon
            path="print"
            size={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
          {UI.CEREMONY_PRINT}
        </button>
      </div>
    </div>
  );
}
