"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { GioReminderManageView as View } from "@/lib/api/modules/gio-reminders";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";

/** Trang tắt nhắc giỗ (link trong email). GET chỉ hiển thị; bấm nút mới tắt. */
export default function GioReminderManageView({ token }: { token: string }) {
  const [view, setView] = useState<View | null>(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.gioReminders.get(token).then(setView, () => setMissing(true));
  }, [token]);

  async function unsubscribe() {
    setBusy(true);
    try {
      await api.gioReminders.unsubscribe(token);
      setDone(true);
    } catch (err) {
      notify.error(err, UI.ERR_FETCH_DATA);
    } finally {
      setBusy(false);
    }
  }

  if (missing) return <p className="text-sm text-[#504443]">{UI.GR_MANAGE_NOT_FOUND}</p>;
  if (!view) return <p className="text-sm text-[#504443]">{UI.LOADING}</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#321716]">{UI.GR_MANAGE_INFO(view.deceasedName, view.lunarDay, view.lunarMonth)}</p>
      {done || !view.active ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800" role="status">
          {done ? UI.GR_MANAGE_DONE : UI.GR_MANAGE_ALREADY_OFF}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => void unsubscribe()}
          disabled={busy}
          className="rounded-xl bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4a2c2a] disabled:opacity-60"
        >
          {UI.GR_MANAGE_BUTTON}
        </button>
      )}
    </div>
  );
}
