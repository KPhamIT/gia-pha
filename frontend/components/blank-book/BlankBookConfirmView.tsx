"use client";

import { useEffect, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import { formatVnd } from "@/components/family-tree/events/event-format";
import { api } from "@/lib/api";
import type { BlankBookConfirmView as ConfirmData } from "@/lib/api/modules/blank-book";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";

type State = "loading" | "invalid" | "ready" | "confirming" | "done";

/**
 * Trang chủ web mở từ email. GET chỉ hiển thị đơn — trạng thái chỉ đổi khi bấm nút (POST),
 * nên trình quét link của hộp thư không tự xác nhận được.
 */
export default function BlankBookConfirmView({ token }: { token: string }) {
  const [state, setState] = useState<State>("loading");
  const [order, setOrder] = useState<ConfirmData | null>(null);

  useEffect(() => {
    api.blankBook
      .getForConfirm(token)
      .then((data) => {
        setOrder(data);
        setState("ready");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function confirm() {
    setState("confirming");
    try {
      setOrder(await api.blankBook.confirm(token));
      setState("done");
    } catch (err) {
      notify.error(err, UI.BLANK_BOOK_CONFIRM_FAILED);
      setState("ready");
    }
  }

  if (state === "loading") return <p className={`text-sm ${AC.muted}`}>{UI.LOADING}</p>;
  if (state === "invalid" || !order) return <p className={`text-sm ${AC.muted}`}>{UI.BLANK_BOOK_CONFIRM_INVALID}</p>;

  const rows: [string, string][] = [
    [UI.BLANK_BOOK_ORDER_CODE, order.code],
    [UI.BLANK_BOOK_ORDER_AMOUNT, formatVnd(order.amountVnd)],
    [UI.BLANK_BOOK_ORDER_CLAN, order.clanName],
    [UI.BLANK_BOOK_ORDER_PAGES, String(order.pageCount)],
    [UI.BLANK_BOOK_CONTACT, [order.contactEmail, order.contactPhone].filter(Boolean).join(" · ")],
  ];

  return (
    <div className="space-y-5">
      <dl className={`${AC.cardMuted} space-y-2 p-4 text-sm`}>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className={AC.label}>{k}</dt>
            <dd className="text-right font-semibold text-[#321716]">{v}</dd>
          </div>
        ))}
      </dl>
      {state === "done" ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800" role="status">
          {UI.BLANK_BOOK_CONFIRM_DONE}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={state === "confirming"}
          className="w-full rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7a3d00] disabled:opacity-60"
        >
          {state === "confirming" ? UI.BLANK_BOOK_CONFIRMING : UI.BLANK_BOOK_CONFIRM_BUTTON}
        </button>
      )}
    </div>
  );
}
