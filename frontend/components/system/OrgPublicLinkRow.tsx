"use client";

import { useCallback } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";

type OrgPublicLinkRowProps = {
  name: string;
  publicAccessUrl?: string;
};

export default function OrgPublicLinkRow({ name, publicAccessUrl }: OrgPublicLinkRowProps) {
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
    <div className="mt-2 flex flex-col gap-2 border-t border-amber-100 pt-2 sm:flex-row sm:items-center">
      <p className="min-w-0 flex-1 truncate text-xs text-neutral-500">
        {UI.ORG_SHARE_LINK_FOR(name)}
      </p>
      <IconRoundButton
        icon="share"
        variant="outline"
        size="dense"
        iconSize={16}
        label={UI.ORG_SHARE_COPY}
        onClick={() => void handleCopy()}
      />
    </div>
  );
}
