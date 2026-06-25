"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAuthStore } from "@/store/authStore";
import { setToken } from "@/lib/auth/session";
import { rebindPushAfterLogin } from "@/lib/notifications/push-binding";
import {
  setStoredOrgAccessToken,
  syncOrgAccessTokenFromAuth,
} from "@/lib/org/org-access";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { getErrorMessage } from "@/utils/errors";
import AuthPageLoading from "@/components/ui/AuthPageLoading";

const labelClass = "mb-1 block text-sm font-medium text-amber-100";

export default function RegisterOrganizationForm() {
  const router = useRouter();
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isDemo = useAuthStore((state) => state.isDemo);
  const refreshAuth = useAuthStore((state) => state.refresh);

  const [orgName, setOrgName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishSignup = useCallback(
    async (accessToken: string, orgAccessToken?: string | null) => {
      setToken(accessToken);
      syncOrgAccessTokenFromAuth(orgAccessToken);
      if (orgAccessToken) {
        setStoredOrgAccessToken(orgAccessToken);
      }
      invalidateUserSettingsCache();
      await refreshAuth();
      await rebindPushAfterLogin();
      router.replace("/org-users");
    },
    [refreshAuth, router],
  );

  const handleGuestSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const name = orgName.trim();
      const loginName = username.trim();
      if (!name || !loginName || !password) return;
      if (password !== passwordConfirm) {
        setError(UI.ORG_REGISTER_PASSWORD_MISMATCH);
        return;
      }

      setSaving(true);
      setError(null);
      try {
        const result = await api.organizations.registerWithAdmin({
          name,
          username: loginName,
          password,
          email: email.trim() || undefined,
        });
        await finishSignup(result.accessToken, result.orgAccessToken);
      } catch (err) {
        setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      } finally {
        setSaving(false);
      }
    },
    [email, finishSignup, orgName, password, passwordConfirm, username],
  );

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
    return <AuthPageLoading />;
  }

  if (isAdmin) {
    return (
      <div className="space-y-4">
        <p className={`text-sm leading-relaxed ${BT.mutedOnDark}`}>{UI.ORG_REGISTER_ALREADY_ADMIN}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/org-users" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGold} inline-flex`}>
            {UI.ORG_REGISTER_GO_MANAGE}
          </Link>
          <Link href="/account" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} border-amber-200/40 text-amber-50`}>
            {UI.ORG_REGISTER_GO_SHARE}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoggedIn && !isDemo) {
    return (
      <form className={`${BT.card} space-y-4 p-4`} onSubmit={(e) => void handleLoggedInSubmit(e)}>
        <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>{UI.ORG_REGISTER_LOGGED_IN_HINT}</p>
        <label className="block">
          <span className={`${labelClass} text-neutral-800`}>{UI.ORG_REGISTER_NAME_LABEL}</span>
          <input
            className={inputClassName}
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder={UI.ORG_REGISTER_NAME_PLACEHOLDER}
            maxLength={120}
            required
          />
        </label>
        {error ? <p className={BT.errorBgLight}>{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <IconRoundButton
            type="submit"
            icon="plus"
            variant="gold"
            loading={saving}
            label={UI.ORG_REGISTER_SUBMIT}
            compact={false}
          />
          <Link href="/" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}>
            {UI.CONTACT_PAGE_BACK}
          </Link>
        </div>
      </form>
    );
  }

  return (
    <form className={`${BT.card} space-y-4 p-4`} onSubmit={(e) => void handleGuestSubmit(e)}>
      <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
        {isDemo ? UI.ORG_REGISTER_DEMO_HINT : UI.ORG_REGISTER_HINT}
      </p>

      <label className="block">
        <span className={`${labelClass} text-neutral-800`}>{UI.ORG_REGISTER_NAME_LABEL}</span>
        <input
          className={inputClassName}
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder={UI.ORG_REGISTER_NAME_PLACEHOLDER}
          maxLength={120}
          required
        />
      </label>

      <label className="block">
        <span className={`${labelClass} text-neutral-800`}>{UI.ORG_REGISTER_ADMIN_USERNAME}</span>
        <input
          className={inputClassName}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={UI.ORG_REGISTER_ADMIN_USERNAME_PLACEHOLDER}
          autoComplete="username"
          maxLength={64}
          required
        />
      </label>

      <label className="block">
        <span className={`${labelClass} text-neutral-800`}>{UI.ORG_REGISTER_ADMIN_PASSWORD}</span>
        <input
          type="password"
          className={inputClassName}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      <label className="block">
        <span className={`${labelClass} text-neutral-800`}>{UI.ORG_REGISTER_ADMIN_PASSWORD_CONFIRM}</span>
        <input
          type="password"
          className={inputClassName}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      <label className="block">
        <span className={`${labelClass} text-neutral-800`}>{UI.ORG_REGISTER_ADMIN_EMAIL}</span>
        <input
          type="email"
          className={inputClassName}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      {error ? <p className={BT.errorBgLight}>{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <IconRoundButton
          type="submit"
          icon="plus"
          variant="gold"
          loading={saving}
          label={UI.ORG_REGISTER_SUBMIT}
          compact={false}
        />
        <Link
          href={isLoggedIn ? "/" : "/login?next=/tao-dong-ho"}
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}
        >
          {isLoggedIn ? UI.CONTACT_PAGE_BACK : UI.LOGIN_BUTTON}
        </Link>
      </div>
    </form>
  );
}
