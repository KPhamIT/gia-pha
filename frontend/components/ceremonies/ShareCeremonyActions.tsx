"use client";

import { useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { shareCeremonyLink } from "@/utils/ceremony-share";

type ShareCeremonyActionsProps = {
  personId?: number;
  fullName: string;
  /** Link công khai đã có sẵn (trang /ceremonies/share/...). */
  shareUrl?: string;
  /** Nút nhỏ gọn trên danh sách ngày giỗ sắp tới */
  compact?: boolean;
};

export default function ShareCeremonyActions({
  personId,
  fullName,
  shareUrl,
  compact = false,
}: ShareCeremonyActionsProps) {
  const [busy, setBusy] = useState(false);
  const canShare = shareUrl != null || personId != null;

  const handleShare = async () => {
    if (!canShare) return;
    setBusy(true);
    try {
      const result = await shareCeremonyLink(fullName, personId ?? 0, shareUrl);
      if (result === "shared") {
        notify.success(UI.CEREMONY_SHARE_SUCCESS);
      } else if (result === "copied") {
        notify.success(UI.CEREMONY_SHARE_COPIED);
      } else if (result === "cancelled") {
        return;
      } else {
        notify.error(null, UI.CEREMONY_SHARE_FAILED);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <IconRoundButton
      icon="share"
      variant={compact ? "outline" : "gold"}
      label={UI.CEREMONY_SHARE}
      iconSize={compact ? 18 : undefined}
      loading={busy}
      disabled={busy || !canShare}
      onClick={() => void handleShare()}
    />
  );
}
