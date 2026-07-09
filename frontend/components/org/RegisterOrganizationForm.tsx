"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
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
import { getErrorMessage } from "@/utils/errors";
import AuthPageLoading from "@/components/ui/AuthPageLoading";

const labelClass = "mb-1.5 block text-sm font-medium text-[#321716]";
const inputClass =
  "w-full rounded-lg border border-[#d4c3c1] bg-white px-3 py-2.5 text-base text-[#1c1c19] outline-none transition focus:border-[#4a2c2a] focus:ring-2 focus:ring-[#4a2c2a]/15 md:text-sm";
const cardClass =
  "rounded-2xl border border-[#d4c3c1] bg-white p-6 shadow-sm md:p-8";
const errorClass =
  "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";
const btnPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a2c2a] disabled:opacity-50";
const btnOutline =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee]";

function FormCard({ children }: { children: React.ReactNode }) {
  return <div className={cardClass}>{children}</div>;
}

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
    return (
      <FormCard>
        <AuthPageLoading />
      </FormCard>
    );
  }

  if (isAdmin) {
    return (
      <FormCard>
        <p className="text-sm leading-relaxed text-[#504443]">
          {UI.ORG_REGISTER_ALREADY_ADMIN}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/org-users" className={btnPrimary}>
            {UI.ORG_REGISTER_GO_MANAGE}
          </Link>
          <Link href="/account" className={btnOutline}>
            {UI.ORG_REGISTER_GO_SHARE}
          </Link>
        </div>
      </FormCard>
    );
  }

  if (isLoggedIn && !isDemo) {
    return (
      <form className={`${cardClass} space-y-5`} onSubmit={(e) => void handleLoggedInSubmit(e)}>
        <p className="text-sm leading-relaxed text-[#504443]">
          {UI.ORG_REGISTER_LOGGED_IN_HINT}
        </p>
        <label className="block">
          <span className={labelClass}>{UI.ORG_REGISTER_NAME_LABEL}</span>
          <input
            className={inputClass}
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder={UI.ORG_REGISTER_NAME_PLACEHOLDER}
            maxLength={120}
            required
          />
        </label>
        {error ? (
          <p className={errorClass} role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? UI.SAVING : UI.ORG_REGISTER_SUBMIT}
          </button>
          <Link href="/" className={btnOutline}>
            {UI.CONTACT_PAGE_BACK}
          </Link>
        </div>
      </form>
    );
  }

  return (
    <form className={`${cardClass} space-y-5`} onSubmit={(e) => void handleGuestSubmit(e)}>
      {isDemo ? (
        <p className="text-sm leading-relaxed text-[#504443]">
          {UI.ORG_REGISTER_DEMO_HINT}
        </p>
      ) : null}

      <label className="block">
        <span className={labelClass}>{UI.ORG_REGISTER_NAME_LABEL}</span>
        <input
          className={inputClass}
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder={UI.ORG_REGISTER_NAME_PLACEHOLDER}
          maxLength={120}
          required
        />
      </label>

      <label className="block">
        <span className={labelClass}>{UI.ORG_REGISTER_ADMIN_USERNAME}</span>
        <input
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={UI.ORG_REGISTER_ADMIN_USERNAME_PLACEHOLDER}
          autoComplete="username"
          maxLength={64}
          required
        />
      </label>

      <label className="block">
        <span className={labelClass}>{UI.ORG_REGISTER_ADMIN_PASSWORD}</span>
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      <label className="block">
        <span className={labelClass}>{UI.ORG_REGISTER_ADMIN_PASSWORD_CONFIRM}</span>
        <input
          type="password"
          className={inputClass}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      <label className="block">
        <span className={labelClass}>{UI.ORG_REGISTER_ADMIN_EMAIL}</span>
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      {error ? (
        <p className={errorClass} role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
        <button type="submit" className={`${btnPrimary} w-full sm:w-auto`} disabled={saving}>
          {saving ? UI.SAVING : UI.ORG_REGISTER_SUBMIT}
        </button>
        <Link
          href={isLoggedIn ? "/" : "/login?next=/tao-dong-ho"}
          className={`${btnOutline} w-full sm:w-auto`}
        >
          {isLoggedIn ? UI.CONTACT_PAGE_BACK : UI.LOGIN_BUTTON}
        </Link>
      </div>
    </form>
  );
}
