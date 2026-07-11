"use client";

import { useState } from "react";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { UI } from "@/lib/constants/ui-strings";
import type { RelatedPersonRole } from "@/lib/family-tree/create-related-person";

type Props = {
  role: RelatedPersonRole;
  defaultGender: string;
  disabled?: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    fullName: string;
    gender: string;
    birthDate: string;
  }) => Promise<void>;
};

/** Compact create form for a new father / mother / spouse. */
export default function AddRelatedPersonForm({
  role,
  defaultGender,
  disabled,
  onCancel,
  onSubmit,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState(defaultGender);
  const [birthDate, setBirthDate] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        fullName: fullName.trim(),
        gender,
        birthDate,
      });
    } finally {
      setBusy(false);
    }
  };

  const title =
    role === "father"
      ? UI.RELATION_ADD_FATHER
      : role === "mother"
        ? UI.RELATION_ADD_MOTHER
        : UI.RELATION_ADD_SPOUSE;

  return (
    <div className="relative mt-2 space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
      {busy || disabled ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70">
          <LoadingSpinner size={28} label={UI.SAVING} />
        </div>
      ) : null}
      <p className="text-xs font-semibold text-amber-900">{title}</p>
      <FormField label={UI.CHILD_NAME}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={UI.NAME_PLACEHOLDER}
          className={inputClassName}
          disabled={busy || disabled}
          autoFocus
        />
      </FormField>
      <FormField label={UI.GENDER}>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={inputClassName}
          disabled={busy || disabled}
        >
          <option value="">{UI.GENDER_PLACEHOLDER}</option>
          <option value={UI.GENDER_MALE}>{UI.GENDER_MALE}</option>
          <option value={UI.GENDER_FEMALE}>{UI.GENDER_FEMALE}</option>
        </select>
      </FormField>
      <FormField label={UI.BIRTH_DATE}>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={inputClassName}
          disabled={busy || disabled}
        />
      </FormField>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy || disabled}
          onClick={() => void handleSubmit()}
          className="flex-1 rounded-lg bg-amber-800 px-3 py-2 text-sm font-medium text-white active:bg-amber-900 disabled:opacity-50"
        >
          {UI.SAVE}
        </button>
        <button
          type="button"
          disabled={busy || disabled}
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 active:bg-slate-50 disabled:opacity-50"
        >
          {UI.CANCEL}
        </button>
      </div>
    </div>
  );
}
