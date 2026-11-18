"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import GioReminderDone from "./GioReminderDone";

const INPUT =
  "w-full rounded-lg border border-[#d4c3c1] bg-white px-3 py-2.5 text-base text-[#1c1c19] outline-none focus:border-[#944a00] focus:ring-2 focus:ring-[#944a00]/15 md:text-sm";
const LABEL = "mb-1.5 block text-sm font-medium text-[#321716]";
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

type Done = { name: string; nextDate: string; daysUntil: number };

/** Form nhẹ: tên người mất + ngày/tháng âm lịch + email → bật email nhắc giỗ hằng năm. */
export default function GioReminderForm() {
  const [deceasedName, setDeceasedName] = useState("");
  const [lunarDay, setLunarDay] = useState(1);
  const [lunarMonth, setLunarMonth] = useState(1);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const name = deceasedName.trim();
      const res = await api.gioReminders.create({ deceasedName: name, lunarDay, lunarMonth, email: email.trim() });
      setDone({ name, nextDate: res.nextDate, daysUntil: res.daysUntil });
    } catch (err) {
      notify.error(err, UI.GR_FAILED);
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <GioReminderDone
        {...done}
        onAddAnother={() => {
          setDone(null);
          setDeceasedName("");
        }}
      />
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-5 rounded-2xl border border-[#d4c3c1] bg-white p-6 shadow-sm md:p-8">
      <label className="block">
        <span className={LABEL}>{UI.GR_NAME}</span>
        <input
          className={INPUT}
          value={deceasedName}
          onChange={(e) => setDeceasedName(e.target.value)}
          placeholder={UI.GR_NAME_PLACEHOLDER}
          maxLength={80}
          required
        />
      </label>
      <fieldset>
        <legend className={LABEL}>{UI.GR_LUNAR_DATE}</legend>
        <div className="grid grid-cols-2 gap-3">
          <select aria-label={UI.GR_DAY} className={INPUT} value={lunarDay} onChange={(e) => setLunarDay(Number(e.target.value))}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {UI.GR_DAY_OPTION(d)}
              </option>
            ))}
          </select>
          <select aria-label={UI.GR_MONTH} className={INPUT} value={lunarMonth} onChange={(e) => setLunarMonth(Number(e.target.value))}>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {UI.GR_MONTH_OPTION(m)}
              </option>
            ))}
          </select>
        </div>
      </fieldset>
      <label className="block">
        <span className={LABEL}>{UI.GR_EMAIL}</span>
        <input
          className={INPUT}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={UI.GR_EMAIL_PLACEHOLDER}
          maxLength={254}
          required
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a3d00] disabled:opacity-60"
      >
        {saving ? UI.GR_SUBMITTING : UI.GR_SUBMIT}
      </button>
      <p className="text-center text-xs text-[#827472]">{UI.GR_PRIVACY}</p>
    </form>
  );
}
