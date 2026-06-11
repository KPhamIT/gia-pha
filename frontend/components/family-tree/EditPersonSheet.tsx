'use client';

import { useEffect, useState } from 'react';
import type { PersonDetail, UpdatePersonDetailInput } from '@/components/types/family-tree-types';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import CollapsibleSection, { FormField, inputClassName, textareaClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { toDateInputValue } from '@/utils/person-relationships';

type EditPersonSheetProps = {
  detail: PersonDetail | null;
  loading: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (data: UpdatePersonDetailInput) => void;
};

function buildFormState(detail: PersonDetail | null) {
  const person = detail?.person;
  return {
    fullName: person?.fullName ?? '',
    gender: person?.gender ?? '',
    birthDate: toDateInputValue(person?.birthDate),
    deathDate: toDateInputValue(person?.deathDate),
    generation: person?.generation != null ? String(person.generation) : '',
    branch: person?.branch != null ? String(person.branch) : '1',
    birthPlace: person?.birthPlace ?? '',
    currentLocation: person?.currentLocation ?? '',
    education: person?.education ?? '',
    occupation: person?.occupation ?? '',
    religion: person?.religion ?? '',
    ethnicity: person?.ethnicity ?? '',
    achievements: person?.achievements ?? '',
    biography: person?.biography?.content ?? '',
    cemetery: person?.graveInfo?.cemetery ?? '',
    graveAddress: person?.graveInfo?.address ?? '',
    graveNotes: person?.graveInfo?.notes ?? '',
  };
}

export default function EditPersonSheet({ detail, loading, saving, onClose, onSave }: EditPersonSheetProps) {
  const [form, setForm] = useState(buildFormState(detail));

  useEffect(() => {
    setForm(buildFormState(detail));
  }, [detail]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }

    onSave({
      fullName: form.fullName.trim(),
      gender: form.gender || undefined,
      birthDate: form.birthDate || undefined,
      deathDate: form.deathDate || undefined,
      generation: form.generation ? Number(form.generation) : undefined,
      branch: form.branch ? Number(form.branch) : undefined,
      birthPlace: form.birthPlace || undefined,
      currentLocation: form.currentLocation || undefined,
      education: form.education || undefined,
      occupation: form.occupation || undefined,
      religion: form.religion || undefined,
      ethnicity: form.ethnicity || undefined,
      achievements: form.achievements || undefined,
      biography: form.biography,
      graveInfo: {
        cemetery: form.cemetery || undefined,
        address: form.graveAddress || undefined,
        notes: form.graveNotes || undefined,
      },
    });
  };

  return (
    <FullScreenSheet title={UI.EDIT_PERSON} onClose={onClose}>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size={36} label={UI.LOADING} />
        </div>
      ) : (
        <>
          <CollapsibleSection title={UI.SECTION_BASIC} defaultOpen>
            <FormField label={UI.CHILD_NAME}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label={UI.GENDER}>
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className={inputClassName}
                disabled={saving}
              >
                <option value="">{UI.GENDER_PLACEHOLDER}</option>
                <option value={UI.GENDER_MALE}>{UI.GENDER_MALE}</option>
                <option value={UI.GENDER_FEMALE}>{UI.GENDER_FEMALE}</option>
              </select>
            </FormField>
            <FormField label={UI.BIRTH_DATE}>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => update('birthDate', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label={UI.DEATH_DATE}>
              <input
                type="date"
                value={form.deathDate}
                onChange={(e) => update('deathDate', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.SECTION_FAMILY}>
            <FormField label="Đời thứ">
              <input
                type="number"
                min={1}
                max={20}
                value={form.generation}
                onChange={(e) => update('generation', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label="Nhánh">
              <select
                value={form.branch}
                onChange={(e) => update('branch', e.target.value)}
                className={inputClassName}
                disabled={saving}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.SECTION_LOCATION}>
            <FormField label={UI.BIRTH_PLACE}>
              <input
                type="text"
                value={form.birthPlace}
                onChange={(e) => update('birthPlace', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label={UI.CURRENT_LOCATION}>
              <input
                type="text"
                value={form.currentLocation}
                onChange={(e) => update('currentLocation', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.EDUCATION}>
            <FormField label={UI.EDUCATION}>
              <input
                type="text"
                value={form.education}
                onChange={(e) => update('education', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.OCCUPATION}>
            <FormField label={UI.OCCUPATION}>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => update('occupation', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={`${UI.RELIGION} & ${UI.ETHNICITY}`}>
            <FormField label={UI.RELIGION}>
              <input
                type="text"
                value={form.religion}
                onChange={(e) => update('religion', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label={UI.ETHNICITY}>
              <input
                type="text"
                value={form.ethnicity}
                onChange={(e) => update('ethnicity', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.SECTION_BIOGRAPHY}>
            <FormField label={UI.BIOGRAPHY}>
              <textarea
                value={form.biography}
                onChange={(e) => update('biography', e.target.value)}
                className={textareaClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.SECTION_ACHIEVEMENTS}>
            <FormField label={UI.ACHIEVEMENTS}>
              <textarea
                value={form.achievements}
                onChange={(e) => update('achievements', e.target.value)}
                className={textareaClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <CollapsibleSection title={UI.SECTION_GRAVE}>
            <FormField label={UI.CEMETERY}>
              <input
                type="text"
                value={form.cemetery}
                onChange={(e) => update('cemetery', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label={UI.GRAVE_ADDRESS}>
              <input
                type="text"
                value={form.graveAddress}
                onChange={(e) => update('graveAddress', e.target.value)}
                className={inputClassName}
                disabled={saving}
              />
            </FormField>
            <FormField label={UI.GRAVE_NOTES}>
              <textarea
                value={form.graveNotes}
                onChange={(e) => update('graveNotes', e.target.value)}
                className={textareaClassName}
                disabled={saving}
              />
            </FormField>
          </CollapsibleSection>

          <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white active:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size={18} label={UI.SAVING} /> : UI.SAVE}
            </button>
          </div>
        </>
      )}
    </FullScreenSheet>
  );
}
