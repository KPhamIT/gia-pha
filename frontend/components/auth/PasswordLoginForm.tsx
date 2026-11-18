"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import ResendVerificationButton from "@/components/auth/email-verify/ResendVerificationButton";
import { api } from "@/lib/api";
import { isEmailNotVerifiedError } from "@/lib/auth/apply-auth-result";
import { setToken } from "@/lib/auth/session";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { rebindPushAfterLogin } from "@/lib/notifications/push-binding";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage } from "@/utils/errors";

const labelClass = `mb-1 block text-sm font-medium ${BT.mutedOnLight}`;

/** Đăng nhập tên/mật khẩu; tài khoản chưa xác nhận email → nút gửi lại email xác nhận. */
export default function PasswordLoginForm({
  nextPath,
  initialError,
}: {
  nextPath: string;
  initialError: string | null;
}) {
  const router = useRouter();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [unverified, setUnverified] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setUnverified(false);
    try {
      const result = await api.auth.login(username.trim(), password);
      setToken(result.accessToken);
      await refreshAuth();
      await rebindPushAfterLogin();
      router.replace(nextPath);
    } catch (err) {
      setError(getErrorMessage(err, UI.LOGIN_ERROR_DEFAULT));
      setUnverified(isEmailNotVerifiedError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error ? (
        <p className={`mt-4 ${BT.errorBgLight}`} role="alert">
          {error}
        </p>
      ) : null}
      {unverified ? (
        <div className="mt-3">
          <ResendVerificationButton login={username.trim()} />
        </div>
      ) : null}

      <form className="mt-6 space-y-3" onSubmit={(e) => void handleSubmit(e)}>
        <label className="block">
          <span className={labelClass}>{UI.LOGIN_USERNAME}</span>
          <input
            className={inputClassName}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block">
          <span className={labelClass}>{UI.LOGIN_PASSWORD}</span>
          <input
            type="password"
            className={inputClassName}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <div className="flex justify-center pt-2">
          <IconRoundButton
            type="submit"
            icon="lock"
            variant="primary"
            iconSize={18}
            loading={loading}
            label={UI.BTN_LOGIN}
            compact={false}
          />
        </div>
      </form>
    </>
  );
}
