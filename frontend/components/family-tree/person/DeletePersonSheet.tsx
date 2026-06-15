'use client';

import type { Person } from '@/components/types/family-tree-types';
import BottomSheet from '@/components/ui/BottomSheet';
import Icon from '@/components/icons/Icon';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { UI } from '@/lib/constants/ui-strings';

type DeletePersonSheetProps = {
  person: Person;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeletePersonSheet({ person, loading = false, onClose, onConfirm }: DeletePersonSheetProps) {
  return (
    <BottomSheet onClose={onClose} maxWidth="md" zClass="z-[60]">
      <div className={LAYOUT.pagePad}>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
            <Icon path="alertTriangle" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{UI.DELETE_PERSON_CONFIRM(person.fullName)}</p>
            <p className="text-xs text-slate-500">{UI.DELETE_IRREVERSIBLE}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 py-3 text-sm font-medium text-slate-700 active:bg-slate-50 md:hover:bg-slate-50"
            disabled={loading}
          >
            {UI.CANCEL}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 py-3 text-sm font-medium text-white active:bg-red-700 md:hover:bg-red-700 disabled:opacity-50"
            disabled={loading}
          >
            {UI.DELETE_PERSON}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
