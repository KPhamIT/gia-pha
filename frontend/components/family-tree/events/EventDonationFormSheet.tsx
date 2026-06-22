"use client";

import { useMemo, useState } from "react";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/ui/CollapsibleSection";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";
import type { Person } from "@/components/types/family-tree-types";
import type {
  CreateDonationInput,
  DonationDraftItem,
  DonationKind,
} from "@/components/types/event-types";
import DonationMemberPicker from "./DonationMemberPicker";

type Props = {
  initial?: DonationDraftItem | null;
  persons: Person[];
  onSubmit: (input: CreateDonationInput) => void;
  onClose: () => void;
};

function KindTag({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-amber-600 text-white"
          : "bg-slate-100 text-slate-600 active:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function EventDonationFormSheet({
  initial,
  persons,
  onSubmit,
  onClose,
}: Props) {
  const [donorName, setDonorName] = useState(initial?.donorName ?? "");
  const [personId, setPersonId] = useState<number | null>(
    initial?.personId ?? null,
  );
  const [kind, setKind] = useState<DonationKind>(initial?.kind ?? "MONEY");
  const [amount, setAmount] = useState(
    initial?.kind !== "IN_KIND" && initial?.amount
      ? String(initial.amount)
      : "",
  );
  const [itemDescription, setItemDescription] = useState(
    initial?.itemDescription ?? "",
  );
  const [note, setNote] = useState(initial?.note ?? "");

  const selectedPerson = useMemo(
    () =>
      personId != null
        ? (persons.find((p) => p.id === personId) ?? null)
        : null,
    [personId, persons],
  );

  const handleSubmit = () => {
    if (!donorName.trim()) {
      alert(UI.EVENT_DONATION_NAME_REQUIRED);
      return;
    }
    if (kind === "IN_KIND" && !itemDescription.trim()) {
      alert(UI.EVENT_DONATION_ITEM_REQUIRED);
      return;
    }

    const parsedAmount = Number.parseInt(amount, 10);
    onSubmit({
      donorName: donorName.trim(),
      personId,
      kind,
      amount:
        kind === "MONEY" ? (Number.isNaN(parsedAmount) ? 0 : parsedAmount) : 0,
      itemDescription: kind === "IN_KIND" ? itemDescription.trim() : undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <FullScreenSheet
      title={initial ? UI.EVENT_DONATION_EDIT : UI.EVENT_DONATION_ADD}
      onClose={onClose}
      tone="book"
      headerRight={
        <IconRoundButton
          icon="check"
          variant="gold"
          label={UI.EVENT_DONATION_FORM_DONE}
          onClick={handleSubmit}
        />
      }
    >
      <div className={LAYOUT.pagePad}>
        <div className="space-y-4 rounded-2xl bg-white p-4 text-slate-900 shadow-sm">
          <FormField label={UI.EVENT_DONATION_KIND_LABEL}>
            <div className="flex gap-2">
              <KindTag
                active={kind === "MONEY"}
                label={UI.EVENT_DONATION_KIND_MONEY}
                onClick={() => setKind("MONEY")}
              />
              <KindTag
                active={kind === "IN_KIND"}
                label={UI.EVENT_DONATION_KIND_IN_KIND}
                onClick={() => setKind("IN_KIND")}
              />
            </div>
          </FormField>

          <FormField label={UI.EVENT_DONATION_PICK_MEMBER}>
            <DonationMemberPicker
              persons={persons}
              selectedPerson={selectedPerson}
              onSelect={(person) => {
                setPersonId(person.id);
                setDonorName(person.fullName);
              }}
              onClear={() => setPersonId(null)}
            />
          </FormField>

          <FormField
            label={
              selectedPerson
                ? UI.EVENT_DONATION_NAME_LABEL
                : UI.EVENT_DONATION_OR_MANUAL
            }
          >
            <input
              type="text"
              value={donorName}
              onChange={(e) => {
                setDonorName(e.target.value);
                if (personId != null) setPersonId(null);
              }}
              placeholder={UI.EVENT_DONATION_NAME_PLACEHOLDER}
              className={inputClassName}
            />
          </FormField>

          {kind === "MONEY" ? (
            <FormField label={UI.EVENT_DONATION_AMOUNT_LABEL}>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d]/g, ""))
                }
                placeholder={UI.EVENT_AMOUNT_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
          ) : (
            <FormField label={UI.EVENT_DONATION_ITEM_LABEL}>
              <input
                type="text"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder={UI.EVENT_DONATION_ITEM_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
          )}

          <FormField label={UI.EVENT_DONATION_NOTE_LABEL}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={UI.EVENT_DONATION_NOTE_PLACEHOLDER}
              className={textareaClassName}
            />
          </FormField>
        </div>
      </div>
    </FullScreenSheet>
  );
}
