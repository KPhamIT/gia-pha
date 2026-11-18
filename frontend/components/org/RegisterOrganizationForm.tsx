"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAuthStore } from "@/store/authStore";
import { setStoredOrgAccessToken } from "@/lib/org/org-access";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import RegisterGuestForm from "./RegisterGuestForm";
import { RF } from "./register-form-styles";

export default function RegisterOrganizationForm() {
  const router = useRouter();
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isDemo = useAuthStore((state) => state.isDemo);
  const refreshAuth = useAuthStore((state) => state.refresh);

  const [orgName, setOrgName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoggedInSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const name = orgName.trim();
      if (!name) return;

      setSaving(true);
      setError(null);
      try {
        const org = await api.organizations.register(name);
        if (org.accessToken) {
          setStoredOrgAccessToken(org.accessToken);
        }
        invalidateUserSettingsCache();
        await refreshAuth();
        router.replace("/org-users");
      } catch (err) {
        setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      } finally {
        setSaving(false);
      }
    },
    [orgName, refreshAuth, router],
  );

  if (!loaded) {
    return (
      <div className={RF.card}>
        <AuthPageLoading />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className={RF.card}>
        <p className="text-sm leading-relaxed text-[#504443]">{UI.ORG_REGISTER_ALREADY_ADMIN}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/org-users" className={RF.btnPrimary}>
            {UI.ORG_REGISTER_GO_MANAGE}
          </Link>
          <Link href="/account" className={RF.btnOutline}>
            {UI.ORG_REGISTER_GO_SHARE}
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || isDemo) {
    return <RegisterGuestForm isLoggedIn={isLoggedIn} isDemo={isDemo} />;
  }

  return (
    <form className={`${RF.card} space-y-5`} onSubmit={(e) => void handleLoggedInSubmit(e)}>
      <p className="text-sm leading-relaxed text-[#504443]">{UI.ORG_REGISTER_LOGGED_IN_HINT}</p>
      <label className="block">
        <span className={RF.label}>{UI.ORG_REGISTER_NAME_LABEL}</span>
        <input
          className={RF.input}
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder={UI.ORG_REGISTER_NAME_PLACEHOLDER}
          maxLength={120}
          required
        />
      </label>
      {error ? (
        <p className={RF.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" className={RF.btnPrimary} disabled={saving}>
          {saving ? UI.SAVING : UI.ORG_REGISTER_SUBMIT}
        </button>
        <Link href="/" className={RF.btnOutline}>
          {UI.CONTACT_PAGE_BACK}
        </Link>
      </div>
    </form>
  );
}
