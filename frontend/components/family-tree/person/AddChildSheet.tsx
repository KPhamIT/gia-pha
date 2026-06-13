'use client';

import { useState } from 'react';
import type { CreateChildFormInput, Person } from '@/components/types/family-tree-types';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import { FormField, inputClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';

const EMPTY_CHILD_FORM = {
  fullName: '',
  gender: '',
  birthDate: '',
  avatar: '',
};

type AddChildSheetProps = {
  parent: Person;
  onClose: () => void;
  onCreateChild: (childData: CreateChildFormInput) => void;
  loading?: boolean;
};

export default function AddChildSheet({ parent, onClose, onCreateChild, loading = false }: AddChildSheetProps) {
  const [form, setForm] = useState(EMPTY_CHILD_FORM);

  const handleSubmit = () => {
    if (!form.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }

    onCreateChild({
      ...form,
      generation: parent.generation != null ? parent.generation + 1 : 1,
      branch: parent.branch != null ? String(parent.branch) : '1',
      parentId: parent.id,
    });
  };

  return (
    <FullScreenSheet title={`${UI.ADD_CHILD_FOR} ${parent.fullName}`} onClose={onClose}>
      <div className="relative space-y-4 p-4">
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <LoadingSpinner size={36} label={UI.SAVING} />
          </div>
        ) : null}

        <FormField label={UI.CHILD_NAME}>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder={UI.NAME_PLACEHOLDER}
            className={inputClassName}
            disabled={loading}
          />
        </FormField>

        <FormField label={UI.GENDER}>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className={inputClassName}
            disabled={loading}
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
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            className={inputClassName}
            disabled={loading}
          />
        </FormField>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-green-600 py-3.5 text-sm font-semibold text-white active:bg-green-700 disabled:opacity-50"
        >
          {UI.SAVE}
        </button>
      </div>
    </FullScreenSheet>
  );
}
