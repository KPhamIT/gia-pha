"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AC } from "@/components/auth/account-theme";
import { api } from "@/lib/api";
import type { EmailVerificationInfo } from "@/lib/api/modules/auth";
import { applyAuthResult } from "@/lib/auth/apply-auth-result";
import { UI } from "@/lib/constants/ui-strings";
import { rebindPushAfterLogin } from "@/lib/notifications/push-binding";
import { notify } from "@/lib/notify";
import { useAuthStore } from "@/store/authStore";
import ResendVerificationButton from "./ResendVerificationButton";

type State = "loading" | "invalid" | "ready" | "confirming" | "done";

/**
 * Mở từ email xác nhận. GET chỉ hiển thị — tài khoản chỉ kích hoạt khi bấm nút (POST),
 * nên trình quét link của hộp thư không dùng mất token.
 */
export default function EmailVerifyView({ token }: { token: string }) {
  const router = useRouter();
  const refreshAuth = useAuthStore((s) => s.refresh);
  const [state, setState] = useState<State>("loading");
  const [info, setInfo] = useState<EmailVerificationInfo | null>(null);

  useEffect(() => {
    api.auth
      .getEmailVerification(token)
      .then((data) => {
        setInfo(data);
        setState("ready");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function confirm() {
    setState("confirming");
    try {
      applyAuthResult(await api.auth.verifyEmail(token));
      setState("done");
      await refreshAuth();
      await rebindPushAfterLogin();
      router.replace("/family-tree");
    } catch (err) {
      notify.error(err, UI.VERIFY_FAILED);
      setState("ready");
    }
  }

  if (state === "loading") return <p className={`text-sm ${AC.muted}`}>{UI.LOADING}</p>;
  if (state === "invalid" || !info) {
    return (
      <div className="space-y-4">
        <p className={`text-sm leading-relaxed ${AC.muted}`}>{UI.VERIFY_INVALID}</p>
        <ResendVerificationButton />
      </div>
    );
  }

  const rows: [string, string | null][] = [
    [UI.VERIFY_FIELD_USERNAME, info.username],
    [UI.VERIFY_FIELD_EMAIL, info.email],
    [UI.VERIFY_FIELD_CLAN, info.organizationName],
  ];

  return (
    <div className="space-y-5">
      <p className={`text-sm ${AC.muted}`}>{UI.VERIFY_PAGE_INTRO}</p>
      <dl className={`${AC.cardMuted} space-y-2 p-4 text-sm`}>
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className={AC.label}>{k}</dt>
              <dd className="break-all text-right font-semibold text-[#321716]">{v}</dd>
            </div>
          ))}
      </dl>
      {state === "done" ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800" role="status">
          {UI.VERIFY_DONE}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={state === "confirming"}
          className="min-h-11 w-full rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7a3d00] disabled:opacity-60"
        >
          {state === "confirming" ? UI.VERIFY_CONFIRMING : UI.VERIFY_BUTTON}
        </button>
      )}
    </div>
  );
}
