"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

type Status = "idle" | "sending" | "sent" | "error";

/** Gửi lại email xác nhận. `login` = tên đăng nhập hoặc email; nếu không truyền, hiện ô nhập. */
export default function ResendVerificationButton({ login }: { login?: string }) {
  const [value, setValue] = useState(login ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const target = (login ?? value).trim();

  async function resend() {
    if (!target) return;
    setStatus("sending");
    setError(null);
    try {
      await api.auth.resendVerification(target);
      setStatus("sent");
    } catch (err) {
      setError(getErrorMessage(err, UI.VERIFY_RESEND_FAILED));
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      {login === undefined ? (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#504443]">
            {UI.VERIFY_RESEND_LOGIN_LABEL}
          </span>
          <input
            className="w-full rounded-xl border border-[#d4c3c1] bg-white px-3 py-2.5 text-base text-[#321716] outline-none focus:border-[#944a00] md:text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="username"
          />
        </label>
      ) : null}
      <button
        type="button"
        onClick={() => void resend()}
        disabled={status === "sending" || !target}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#944a00] bg-white px-5 py-2.5 text-sm font-semibold text-[#944a00] transition hover:bg-amber-50 disabled:opacity-50"
      >
        {status === "sending" ? UI.VERIFY_RESENDING : UI.VERIFY_RESEND}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-emerald-800" role="status">
          {UI.VERIFY_RESENT}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
