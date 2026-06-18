'use client';

import { useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { FormField, inputClassName, textareaClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import type { CreateEventInput, EventType, FamilyEvent } from '@/components/types/event-types';
import { BT } from '@/lib/constants/ui-theme';

type Props = {
  initial?: FamilyEvent | null;
  saving: boolean;
  onSubmit: (input: CreateEventInput) => void;
  onClose: () => void;
};

const typeOptions: { value: EventType; label: string }[] = [
  { value: 'INFO', label: UI.EVENT_TYPE_INFO },
  { value: 'CONTRIBUTION', label: UI.EVENT_TYPE_CONTRIBUTION },
];

export default function EventFormSheet({ initial, saving, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [type, setType] = useState<EventType>(initial?.type ?? 'INFO');
  const [eventDate, setEventDate] = useState(initial?.eventDate ? initial.eventDate.slice(0, 10) : '');
  const [amount, setAmount] = useState(initial?.amountPerPerson ? String(initial.amountPerPerson) : '');
  const [maleOnly, setMaleOnly] = useState(initial?.maleOnly ?? false);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert(UI.EVENT_TITLE_REQUIRED);
      return;
    }
    const parsedAmount = Number.parseInt(amount, 10);
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      eventDate: eventDate || undefined,
      amountPerPerson: type === 'CONTRIBUTION' && !Number.isNaN(parsedAmount) ? parsedAmount : 0,
      maleOnly: type === 'CONTRIBUTION' ? maleOnly : false,
    });
  };

  const saveButton = (
    <IconRoundButton icon="save" variant="gold" loading={saving} label={UI.SAVE} onClick={handleSubmit} />
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
                      ? 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-amber-200/80 bg-white text-neutral-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>

          {type === 'CONTRIBUTION' ? (
            <>
              <FormField label={UI.EVENT_AMOUNT_LABEL}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
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
                  <span className="block text-sm font-medium text-neutral-900">{UI.EVENT_MALE_ONLY_LABEL}</span>
                  <span className={`block text-xs ${BT.mutedOnLight}`}>{UI.EVENT_MALE_ONLY_HINT}</span>
                </span>
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    maleOnly ? 'bg-amber-700' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      maleOnly ? 'left-[1.375rem]' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            </>
          ) : null}

          <FormField label={UI.EVENT_DATE_LABEL}>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputClassName}
              disabled={saving}
            />
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
