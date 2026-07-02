"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconName } from "@/components/icons/icon-paths";
import LandingCardHeader from "@/components/public/LandingCardHeader";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { fetchDefaultJoinLinkUrl } from "@/lib/org/default-join-link";
import { parseOrgJoinLink } from "@/lib/org/parse-join-link";
import { getJoinLinkInputPlaceholder } from "@/lib/site-url";
import { UI } from "@/lib/constants/ui-strings";

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
  const { loaded, isLoggedIn, isDemo } = useAuthBootstrap();
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) return;

    let cancelled = false;
    void fetchDefaultJoinLinkUrl({ isLoggedIn, isDemo }).then((url) => {
      if (!cancelled && url) setLink(url);
    });
    return () => {
      cancelled = true;
    };
  }, [loaded, isLoggedIn, isDemo]);

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
    <div className="rounded-xl border border-[#d4c3c1] bg-white p-6 shadow-sm md:p-8">
      <LandingCardHeader
        icon={icon}
        title={title}
        titleClassName="text-lg font-semibold text-[#321716]"
      />
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#504443]">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium text-[#321716]">
          {UI.LANDING_START_HAS_LINK_INPUT_LABEL}
        </span>
        <input
          type="url"
          inputMode="url"
          autoComplete="off"
          className={`${inputClassName} border-[#d4c3c1] bg-white text-[#1c1c19] focus:border-[#321716] focus:ring-[#321716]/20`}
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
        <p className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={handleJoin}
          className="w-full rounded-lg bg-[#321716] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4a2c2a]"
        >
          {UI.LANDING_START_HAS_LINK_CTA}
        </button>
      </div>
    </div>
  );
}
