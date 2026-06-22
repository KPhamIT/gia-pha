"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { OrganizationAccessLink } from "@/lib/api/modules/organizations";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { notify } from "@/lib/notify";
import { getErrorMessage } from "@/utils/errors";

export default function OrgShareLinkSection() {
  const [link, setLink] = useState<OrganizationAccessLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.organizations
      .getAccessLink()
      .then(setLink)
      .catch((err) => setError(getErrorMessage(err, UI.ERR_FETCH_DATA)))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = useCallback(async () => {
    if (!link?.publicAccessUrl) return;
    try {
      await navigator.clipboard.writeText(link.publicAccessUrl);
      notify.success(UI.ORG_SHARE_COPIED);
    } catch {
      notify.error(null, UI.ORG_SHARE_COPY_FAILED);
    }
  }, [link?.publicAccessUrl]);

  if (loading) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  if (error || !link) {
    return error ? <p className={BT.errorBgLight}>{error}</p> : null;
  }

  return (
    <section className={`${BT.card} space-y-3 p-4`}>
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">{UI.ORG_SHARE_TITLE}</h2>
        <p className={`mt-1 text-xs leading-relaxed ${BT.mutedOnLight}`}>
          {UI.ORG_SHARE_HINT}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          value={link.publicAccessUrl}
          className="min-w-0 flex-1 rounded-lg border border-amber-200/70 bg-white px-3 py-2 text-xs text-neutral-800"
        />
        <IconRoundButton
          icon="share"
          variant="gold"
          label={UI.ORG_SHARE_COPY}
          onClick={() => void handleCopy()}
        />
      </div>
    </section>
  );
}
