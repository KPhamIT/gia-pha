"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconName } from "@/components/icons/icon-paths";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import LandingStartCta from "@/components/public/LandingStartCta";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { api } from "@/lib/api";
import { parseOrgJoinLink } from "@/lib/org/parse-join-link";
import { buildJoinLinkUrl, getJoinLinkInputPlaceholder } from "@/lib/site-url";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { LAYOUT } from "@/lib/constants/ui-layout";

type LandingHasLinkCardProps = {
  icon: IconName;
  title: string;
  steps: readonly string[];
};

export default function LandingHasLinkCard({
  icon,
  title,
  steps,
}: LandingHasLinkCardProps) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void api.organizations
      .getDemo()
      .then((demo) => {
        if (cancelled || !demo?.accessToken) return;
        setLink(buildJoinLinkUrl(demo.accessToken));
      })
      .catch(() => {
        /* không có org demo — giữ ô trống */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleJoin = useCallback(() => {
    const path = parseOrgJoinLink(link);
    if (!path) {
      setError(UI.LANDING_START_HAS_LINK_INVALID);
      return;
    }
    setError(null);
    router.push(path);
  }, [link, router]);

  return (
    <div className={`${BT.card} ${LAYOUT.landingStartCard} p-4 md:p-5`}>
      <LandingCardHeader
        icon={icon}
        title={title}
        titleClassName="text-base font-semibold text-neutral-900"
      />
      <ol
        className={`mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed ${BT.mutedOnLight}`}
      >
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <label className="mt-4 block">
        <span className={`mb-1 block text-sm font-medium ${BT.mutedOnLight}`}>
          {UI.LANDING_START_HAS_LINK_INPUT_LABEL}
        </span>
        <input
          type="url"
          inputMode="url"
          autoComplete="off"
          className={inputClassName}
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleJoin();
            }
          }}
          placeholder={getJoinLinkInputPlaceholder()}
        />
      </label>

      {error ? (
        <p className={`mt-2 ${BT.errorBgLight}`} role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        <LandingStartCta
          label={UI.LANDING_START_HAS_LINK_CTA}
          variant="primary"
          onClick={handleJoin}
        />
      </div>
    </div>
  );
}
