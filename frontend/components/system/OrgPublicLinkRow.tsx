"use client";

import { useCallback } from "react";
import Icon from "@/components/icons/Icon";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";

type OrgPublicLinkRowProps = {
  name: string;
  publicAccessUrl?: string;
  variant?: "book" | "landing";
};

export default function OrgPublicLinkRow({
  name,
  publicAccessUrl,
  variant = "book",
}: OrgPublicLinkRowProps) {
  const isLanding = variant === "landing";

  const handleCopy = useCallback(async () => {
    if (!publicAccessUrl) return;
    try {
      await navigator.clipboard.writeText(publicAccessUrl);
      notify.success(UI.ORG_SHARE_COPIED);
    } catch {
      notify.error(null, UI.ORG_SHARE_COPY_FAILED);
    }
  }, [publicAccessUrl]);

  if (!publicAccessUrl) return null;

  return (
    <div
      className={`mt-2 flex flex-col gap-2 border-t pt-2 sm:flex-row sm:items-center ${
        isLanding ? "border-[#d4c3c1]/40" : "border-amber-100"
      }`}
    >
      <p
        className={`min-w-0 flex-1 truncate text-xs ${
          isLanding ? "text-[#827472]" : "text-neutral-500"
        }`}
      >
        {UI.ORG_SHARE_LINK_FOR(name)}
      </p>
      {isLanding ? (
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d4c3c1] px-3 py-1.5 text-xs font-semibold text-[#321716] hover:bg-[#f6f3ee]"
        >
          <Icon
            path="share"
            size={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
          {UI.ORG_SHARE_COPY}
        </button>
      ) : (
        <IconRoundButton
          icon="share"
          variant="outline"
          size="dense"
          iconSize={16}
          label={UI.ORG_SHARE_COPY}
          onClick={() => void handleCopy()}
        />
      )}
    </div>
  );
}
