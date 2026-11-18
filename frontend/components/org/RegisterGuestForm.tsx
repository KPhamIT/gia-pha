"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";
import VerifyEmailPendingCard from "@/components/auth/email-verify/VerifyEmailPendingCard";
import { RF } from "./register-form-styles";

type Pending = { email: string; username: string; mailSent: boolean };

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
}) {
  const { label, onChange, ...input } = props;
  return (
    <label className="block">
      <span className={RF.label}>{label}</span>
      <input className={RF.input} onChange={(e) => onChange(e.target.value)} required {...input} />
    </label>
  );
}

/** Đăng ký dòng họ cho khách: tạo tài khoản quản trị chờ xác nhận email. */
export default function RegisterGuestForm({ isLoggedIn, isDemo }: { isLoggedIn: boolean; isDemo: boolean }) {
  const [orgName, setOrgName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const name = orgName.trim();
    const loginName = username.trim();
    const mail = email.trim();
    if (!name || !loginName || !password || !mail) return;
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
        email: mail,
      });
      setPending({ email: result.email, username: loginName, mailSent: result.mailSent });
    } catch (err) {
      setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
    } finally {
      setSaving(false);
    }
  }

  if (pending) return <VerifyEmailPendingCard {...pending} />;

  return (
    <form className={`${RF.card} space-y-5`} onSubmit={(e) => void handleSubmit(e)}>
      {isDemo ? <p className="text-sm leading-relaxed text-[#504443]">{UI.ORG_REGISTER_DEMO_HINT}</p> : null}
      <Field
        label={UI.ORG_REGISTER_NAME_LABEL}
        value={orgName}
        onChange={setOrgName}
        placeholder={UI.ORG_REGISTER_NAME_PLACEHOLDER}
        maxLength={120}
      />
      <Field
        label={UI.ORG_REGISTER_ADMIN_USERNAME}
        value={username}
        onChange={setUsername}
        placeholder={UI.ORG_REGISTER_ADMIN_USERNAME_PLACEHOLDER}
        autoComplete="username"
        maxLength={64}
      />
      <Field
        label={UI.ORG_REGISTER_ADMIN_EMAIL}
        value={email}
        onChange={setEmail}
        type="email"
        autoComplete="email"
        maxLength={254}
      />
      <Field
        label={UI.ORG_REGISTER_ADMIN_PASSWORD}
        value={password}
        onChange={setPassword}
        type="password"
        autoComplete="new-password"
        minLength={6}
      />
      <Field
        label={UI.ORG_REGISTER_ADMIN_PASSWORD_CONFIRM}
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        type="password"
        autoComplete="new-password"
        minLength={6}
      />
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
    </form>
  );
}
