"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import JoinPublicShell from "@/components/public/join/JoinPublicShell";
import { api } from "@/lib/api";
import { setStoredOrgAccessToken } from "@/lib/org/org-access";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

type Props = {
  token: string;
};

export default function JoinTokenPageView({ token }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(UI.ORG_JOIN_INVALID);
      return;
    }

    let cancelled = false;
    api.organizations
      .resolvePublic(token)
      .then((org) => {
        if (cancelled) return;
        setStoredOrgAccessToken(org.accessToken);
        invalidateUserSettingsCache();
        router.replace("/book");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err, UI.ORG_JOIN_INVALID));
      });

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <JoinPublicShell>
      <section className="flex min-h-[min(70vh,32rem)] flex-col items-center justify-center px-4 py-16 md:px-6">
        {error ? (
          <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-8 text-center shadow-sm">
            <h1 className="font-serif text-2xl font-semibold text-[#321716]">
              {UI.ORG_JOIN_TITLE}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#504443]" role="alert">
              {error}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/join"
                className="rounded-lg bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a2c2a]"
              >
                {UI.LANDING_START_HAS_LINK_CTA}
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee]"
              >
                {UI.LOGIN_BUTTON}
              </Link>
              <Link
                href="/lien-he"
                className="rounded-lg border border-[#d4c3c1] px-5 py-2.5 text-sm font-semibold text-[#504443] transition hover:bg-[#f6f3ee]"
              >
                {UI.PUBLIC_FOOTER_CONTACT}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <LoadingSpinner size={40} label={UI.LOADING} />
            <p className="text-sm text-[#504443]">{UI.ORG_JOIN_SUBTITLE}</p>
          </div>
        )}
      </section>
    </JoinPublicShell>
  );
}
