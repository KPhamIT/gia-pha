"use client";

import { useState } from "react";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/ui/CollapsibleSection";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import LunarDatePicker from "@/components/ui/LunarDatePicker";
import { UI } from "@/lib/constants/ui-strings";
import type {
  CreateEventInput,
  EventType,
  FamilyEvent,
} from "@/components/types/event-types";
import { BT } from "@/lib/constants/ui-theme";
import {
  lunarYmdToSolarYmd,
  solarYmdToLunarYmd,
} from "@/utils/lunar-date";

type Props = {
  initial?: FamilyEvent | null;
  saving: boolean;
  onSubmit: (input: CreateEventInput) => void;
  onClose: () => void;
};

const typeOptions: { value: EventType; label: string }[] = [
  { value: "INFO", label: UI.EVENT_TYPE_INFO },
  { value: "CONTRIBUTION", label: UI.EVENT_TYPE_CONTRIBUTION },
];

function initialLunarFields(initial?: FamilyEvent | null) {
  const solarYmd = initial?.eventDate?.slice(0, 10) ?? "";
  if (!initial?.isLunar || !solarYmd) {
    return {
      year: String(new Date().getFullYear()),
      day: "",
      month: "",
    };
  }
  const lunar = solarYmdToLunarYmd(solarYmd);
  if (!lunar) {
    return { year: String(new Date().getFullYear()), day: "", month: "" };
  }
  return {
    year: String(lunar.year),
    day: String(lunar.day),
    month: String(lunar.month),
  };
}

function resolveSubmitDate(opts: {
  isLunar: boolean;
  solarYmd: string;
  lunarYear: string;
  lunarDay: string;
  lunarMonth: string;
}): { eventDate?: string; ok: boolean } {
  if (!opts.isLunar) return { eventDate: opts.solarYmd || undefined, ok: true };
  if (!opts.lunarYear || !opts.lunarDay || !opts.lunarMonth) {
    return { ok: true, eventDate: undefined };
  }
  const solar = lunarYmdToSolarYmd(
    Number(opts.lunarYear),
    Number(opts.lunarMonth),
    Number(opts.lunarDay),
  );
  if (!solar) return { ok: false };
  return { ok: true, eventDate: solar };
}

function formatSolarYmdVi(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  if (!y || !m || !d) return ymd;
  return `${Number(d)}/${Number(m)}/${y}`;
}

export default function EventFormSheet({
  initial,
  saving,
  onSubmit,
  onClose,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState<EventType>(initial?.type ?? "INFO");
  const [isLunar, setIsLunar] = useState(initial?.isLunar ?? true);
  const [eventDate, setEventDate] = useState(
    initial?.eventDate ? initial.eventDate.slice(0, 10) : "",
  );
  const lunarInitial = initialLunarFields(initial);
  const [lunarYear, setLunarYear] = useState(lunarInitial.year);
  const [lunarDay, setLunarDay] = useState(lunarInitial.day);
  const [lunarMonth, setLunarMonth] = useState(lunarInitial.month);
  const [amount, setAmount] = useState(
    initial?.amountPerPerson ? String(initial.amountPerPerson) : "",
  );
  const [maleOnly, setMaleOnly] = useState(initial?.maleOnly ?? false);

  const lunarSolarPreview =
    isLunar && lunarYear && lunarDay && lunarMonth
      ? lunarYmdToSolarYmd(
          Number(lunarYear),
          Number(lunarMonth),
          Number(lunarDay),
        )
      : null;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert(UI.EVENT_TITLE_REQUIRED);
      return;
    }
    const resolved = resolveSubmitDate({
      isLunar,
      solarYmd: eventDate,
      lunarYear,
      lunarDay,
      lunarMonth,
    });
    if (!resolved.ok) {
      alert(UI.EVENT_DATE_LUNAR_INVALID);
      return;
    }
    const parsedAmount = Number.parseInt(amount, 10);
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      eventDate: resolved.eventDate,
      isLunar,
      amountPerPerson:
        type === "CONTRIBUTION" && !Number.isNaN(parsedAmount)
          ? parsedAmount
          : 0,
      maleOnly: type === "CONTRIBUTION" ? maleOnly : false,
    });
  };

  const saveButton = (
    <IconRoundButton
      icon="save"
      variant="gold"
      loading={saving}
      label={UI.SAVE}
      onClick={handleSubmit}
    />
  );

  return (
    <FullScreenSheet
      title={initial ? UI.EVENT_EDIT : UI.EVENT_ADD}
      onClose={onClose}
      tone="book"
      headerRight={saveButton}
    >
      <div className={`relative ${BT.pagePad}`}>
        {saving ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <LoadingSpinner size={36} label={UI.SAVING} />
          </div>
        ) : null}

        <div className={`space-y-4 ${BT.card} p-4`}>
          <FormField label={UI.EVENT_TITLE_LABEL}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={UI.EVENT_TITLE_PLACEHOLDER}
              className={inputClassName}
              disabled={saving}
            />
          </FormField>

          <FormField label={UI.EVENT_TYPE_LABEL}>
            <div className="grid grid-cols-1 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  disabled={saving}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    type === option.value
                      ? "border-amber-500 bg-amber-50 text-amber-950"
                      : "border-amber-200/80 bg-white text-neutral-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>

          {type === "CONTRIBUTION" ? (
            <>
              <FormField label={UI.EVENT_AMOUNT_LABEL}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder={UI.EVENT_AMOUNT_PLACEHOLDER}
                  className={inputClassName}
                  disabled={saving}
                />
              </FormField>

              <button
                type="button"
                onClick={() => setMaleOnly((v) => !v)}
                disabled={saving}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-white px-3 py-2.5 text-left"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-neutral-900">
                    {UI.EVENT_MALE_ONLY_LABEL}
                  </span>
                  <span className={`block text-xs ${BT.mutedOnLight}`}>
                    {UI.EVENT_MALE_ONLY_HINT}
                  </span>
                </span>
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    maleOnly ? "bg-amber-700" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      maleOnly ? "left-[1.375rem]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </>
          ) : null}

          <FormField label={UI.EVENT_DATE_LABEL}>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsLunar(false)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                  !isLunar
                    ? "border-amber-500 bg-amber-50 text-amber-950"
                    : "border-amber-200/80 bg-white text-neutral-700"
                }`}
              >
                {UI.EVENT_DATE_CALENDAR_SOLAR}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsLunar(true)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                  isLunar
                    ? "border-amber-500 bg-amber-50 text-amber-950"
                    : "border-amber-200/80 bg-white text-neutral-700"
                }`}
              >
                {UI.EVENT_DATE_CALENDAR_LUNAR}
              </button>
            </div>

            {isLunar ? (
              <div className="space-y-2">
                <input
                  type="number"
                  inputMode="numeric"
                  value={lunarYear}
                  onChange={(e) =>
                    setLunarYear(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder={UI.EVENT_DATE_LUNAR_YEAR}
                  aria-label={UI.EVENT_DATE_LUNAR_YEAR}
                  className={inputClassName}
                  disabled={saving}
                />
                <LunarDatePicker
                  day={lunarDay}
                  month={lunarMonth}
                  disabled={saving}
                  onChange={({ day, month }) => {
                    setLunarDay(day);
                    setLunarMonth(month);
                  }}
                />
                {lunarSolarPreview ? (
                  <p className={`text-xs ${BT.mutedOnLight}`}>
                    {UI.EVENT_DATE_SOLAR_PREVIEW(
                      formatSolarYmdVi(lunarSolarPreview),
                    )}
                  </p>
                ) : null}
              </div>
            ) : (
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            )}
          </FormField>

          <FormField label={UI.EVENT_DESC_LABEL}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={UI.EVENT_DESC_PLACEHOLDER}
              className={textareaClassName}
              disabled={saving}
            />
          </FormField>
        </div>
      </div>
    </FullScreenSheet>
  );
}
