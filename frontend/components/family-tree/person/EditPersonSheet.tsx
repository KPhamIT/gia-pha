'use client';

import { useEffect, useState } from 'react';
import type { PersonDetail, UpdatePersonDetailInput } from '@/components/types/family-tree-types';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { UI } from '@/lib/constants/ui-strings';
import { buildPersonDraft, draftToUpdateInput, type PersonDraft } from '@/utils/person-detail-form';
import PersonDetailFields from './PersonDetailFields';

type EditPersonSheetProps = {
  detail: PersonDetail | null;
  loading: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (data: UpdatePersonDetailInput) => void;
};

export default function EditPersonSheet({ detail, loading, saving, onClose, onSave }: EditPersonSheetProps) {
  const [draft, setDraft] = useState<PersonDraft>(() => buildPersonDraft(detail, '1'));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(buildPersonDraft(detail, '1'));
  }, [detail]);

  const update = (field: keyof PersonDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!draft.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }
    onSave(draftToUpdateInput(draft));
  };

  return (
    <FullScreenSheet title={UI.EDIT_PERSON} onClose={onClose}>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size={36} label={UI.LOADING} />
        </div>
      ) : (
        <>
          <div className={LAYOUT.pagePad}>
            <PersonDetailFields draft={draft} saving={saving} onChange={update} />
          </div>

          <div className={`sticky bottom-0 border-t border-slate-200 bg-white ${LAYOUT.pagePad} pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6`}>
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
