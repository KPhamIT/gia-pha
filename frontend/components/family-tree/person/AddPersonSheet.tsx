'use client';

import { useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { FormField, inputClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';

type AddPersonSheetProps = {
  onClose: () => void;
  onSubmit: (data: { fullName: string; gender: string; birthDate: string }) => void;
  loading?: boolean;
};

export default function AddPersonSheet({ onClose, onSubmit, loading = false }: AddPersonSheetProps) {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = () => {
    if (!fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }
    onSubmit({ fullName: fullName.trim(), gender, birthDate });
  };

  const saveButton = (
    <IconRoundButton icon="save" variant="gold" loading={loading} label={UI.SAVE} onClick={handleSubmit} />
  );

  return (
    <FullScreenSheet title={UI.ADD_PERSON} onClose={onClose} headerRight={saveButton}>
      <div className={`relative ${BT.card} space-y-4 ${LAYOUT.pagePad} md:mx-6 md:mt-4`}>
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <LoadingSpinner size={36} label={UI.SAVING} />
          </div>
        ) : null}

        <FormField label={UI.CHILD_NAME}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={UI.NAME_PLACEHOLDER}
            className={inputClassName}
            disabled={loading}
          />
        </FormField>

        <FormField label={UI.GENDER}>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
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
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={inputClassName}
            disabled={loading}
          />
        </FormField>
      </div>
    </FullScreenSheet>
  );
}
