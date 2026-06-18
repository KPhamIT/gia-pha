'use client';

import { useState } from 'react';
import type { CreateChildFormInput, Person } from '@/components/types/family-tree-types';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { FormField, inputClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { BT } from '@/lib/constants/ui-theme';
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

  const saveButton = (
    <IconRoundButton icon="save" variant="gold" loading={loading} label={UI.SAVE} onClick={handleSubmit} />
  );

  return (
    <FullScreenSheet title={`${UI.ADD_CHILD_FOR} ${parent.fullName}`} onClose={onClose} headerRight={saveButton}>
      <div className={`relative space-y-4 ${BT.card} ${LAYOUT.pagePad} md:mx-6 md:mt-4`}>
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
      </div>
    </FullScreenSheet>
  );
}
