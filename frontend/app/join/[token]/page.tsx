"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import BookPageShell from "@/components/ui/BookPageShell";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { setStoredOrgAccessToken } from "@/lib/org/org-access";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import Link from "next/link";
import { getErrorMessage } from "@/utils/errors";

export default function JoinOrgPage() {
  const params = useParams();
  const router = useRouter();
  const token = typeof params.token === "string" ? params.token : "";
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

  if (error) {
    return (
      <BookPageShell title={UI.ORG_JOIN_TITLE} hideNavFab>
        <p className={`text-sm ${BT.mutedOnDark}`}>{error}</p>
        <Link
          href="/login"
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} mt-4 inline-flex`}
        >
          {UI.LOGIN_BUTTON}
        </Link>
      </BookPageShell>
    );
  }

  return (
    <BookPageShell title={UI.ORG_JOIN_TITLE} hideNavFab>
      <AuthPageLoading />
    </BookPageShell>
  );
}
