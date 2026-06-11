'use client';

import { RelationshipType } from '../types/family-tree-types';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI, RELATIONSHIP_LABELS } from '@/lib/constants/ui-strings';

type Props = {
  pendingType: RelationshipType;
  saving: boolean;
  saveError: string | null;
  onTypeChange: (type: RelationshipType) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConnectRelationshipModal({ pendingType, saving, saveError, onTypeChange, onConfirm, onCancel }: Props) {
  return (
    <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
      <p className="mb-3 text-sm font-semibold text-slate-700">{UI.SELECT_RELATIONSHIP}</p>
      <div className="flex items-center gap-3">
        <select
          className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={pendingType}
          onChange={(e) => onTypeChange(e.target.value as RelationshipType)}
        >
          {(Object.keys(RELATIONSHIP_LABELS) as RelationshipType[]).map((type) => (
            <option key={type} value={type}>{RELATIONSHIP_LABELS[type]}</option>
          ))}
        </select>
        <button
          onClick={onConfirm}
          disabled={saving}
          className="inline-flex min-w-[88px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <LoadingSpinner size={18} label={UI.SAVING} />
              {UI.SAVING}
            </>
          ) : (
            UI.SAVE
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {UI.CANCEL}
        </button>
      </div>
      {saveError && <p className="mt-2 text-xs text-red-500">{saveError}</p>}
    </div>
  );
}
