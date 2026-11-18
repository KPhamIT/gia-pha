"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";
import VerifyEmailPendingCard from "@/components/auth/email-verify/VerifyEmailPendingCard";
import { RF } from "./register-form-styles";

type Pending = { email: string; username: string; mailSent: boolean };

/**
 * Đăng ký dòng họ cho khách — chỉ 3 ô: tên dòng họ, email (để đăng nhập), mật khẩu.
 * Tên đăng nhập do backend tự tạo từ email; tài khoản chờ xác nhận email.
 */
export default function RegisterGuestForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const name = orgName.trim();
    const mail = email.trim();
    if (!name || !password || !mail) return;
    setSaving(true);
    setError(null);
    try {
      const result = await api.organizations.registerWithAdmin({ name, password, email: mail });
      setPending({ email: result.email, username: result.email, mailSent: result.mailSent });
    } catch (err) {
      setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
    } finally {
      setSaving(false);
    }
  }

  if (pending) return <VerifyEmailPendingCard {...pending} />;

  return (
    <form className={`${RF.card} space-y-5`} onSubmit={(e) => void handleSubmit(e)}>
      <p className="text-sm leading-relaxed text-[#504443]">{UI.ORG_REGISTER_FORM_INTRO}</p>
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
      <label className="block">
        <span className={RF.label}>{UI.ORG_REGISTER_ADMIN_EMAIL}</span>
        <input
          className={RF.input}
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={UI.ORG_REGISTER_ADMIN_EMAIL_PLACEHOLDER}
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>
      <label className="block">
        <span className={RF.label}>{UI.ORG_REGISTER_ADMIN_PASSWORD}</span>
        <span className="relative block">
          <input
            className={`${RF.input} pr-16`}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            maxLength={128}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-[#944a00] hover:underline"
          >
            {showPassword ? UI.ORG_REGISTER_PASSWORD_HIDE : UI.ORG_REGISTER_PASSWORD_SHOW}
          </button>
        </span>
        <span className="mt-1 block text-xs text-[#827472]">{UI.ORG_REGISTER_PASSWORD_HINT}</span>
      </label>
      {error ? (
        <p className={RF.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
        <button type="submit" className={`${RF.btnPrimary} w-full sm:w-auto`} disabled={saving}>
          {saving ? UI.SAVING : UI.ORG_REGISTER_SUBMIT}
        </button>
        <Link href={isLoggedIn ? "/" : "/login?next=/tao-dong-ho"} className={`${RF.btnOutline} w-full sm:w-auto`}>
          {isLoggedIn ? UI.CONTACT_PAGE_BACK : UI.LOGIN_BUTTON}
        </Link>
      </div>
      <p className="text-center text-xs text-[#827472]">{UI.ORG_REGISTER_FREE_NOTE}</p>
    </form>
  );
}
