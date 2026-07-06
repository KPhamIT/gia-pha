"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/icons/Icon";
import { api } from "@/lib/api";
import type { OrganizationAccessLink } from "@/lib/api/modules/organizations";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import { getErrorMessage } from "@/utils/errors";
import { AC } from "./account-theme";

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
    return <p className={`text-sm ${AC.muted}`}>{UI.LOADING}</p>;
  }

  if (error || !link) {
    return error ? (
      <p className="rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]">
        {error}
      </p>
    ) : null;
  }

  return (
    <section className={`${AC.cardPaper} space-y-4 p-5 md:p-6`}>
      <div>
        <h2 className={AC.sectionTitle}>{UI.ORG_SHARE_TITLE}</h2>
        <p className={`mt-1 text-sm leading-relaxed ${AC.muted}`}>
          {UI.ORG_SHARE_HINT}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          readOnly
          disabled
          value={link.publicAccessUrl}
          className={`${AC.input} cursor-default text-xs disabled:opacity-100`}
        />
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d4c3c1] bg-white px-4 py-2.5 text-sm font-semibold text-[#321716] transition hover:bg-[#f0ede9]"
        >
          <Icon
            path="share"
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
          {UI.ORG_SHARE_COPY}
        </button>
      </div>
    </section>
  );
}
