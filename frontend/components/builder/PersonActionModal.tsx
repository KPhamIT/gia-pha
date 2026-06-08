'use client';

import { Person, RelationshipType } from '../types/family-tree-types';

type PersonActionModalProps = {
  actionPerson: Person;
  selectedTargets: Person[];
  onClose: () => void;
  onAction: (action: 'ANCESTOR_FATHER' | RelationshipType) => void;
};

export default function PersonActionModal({
  actionPerson,
  selectedTargets,
  onClose,
  onAction,
}: PersonActionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">Hành động với</p>
            <p className="text-base font-semibold text-slate-900">{actionPerson.fullName}</p>
            {actionPerson.generation != null && (
              <p className="text-sm text-slate-500">Đời thứ {actionPerson.generation}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">Áp dụng cho:</p>
            <ul className="mt-2 max-h-32 overflow-auto text-sm text-slate-700">
              {selectedTargets.length === 0 ? (
                <li className="text-slate-500">(Không có người được chọn)</li>
              ) : (
                selectedTargets.map((t) => (
                  <li key={t.id} className="mb-1">{t.fullName}{t.generation ? ` — Đời ${t.generation}` : ''}</li>
                ))
              )}
            </ul>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => onAction('ANCESTOR_FATHER')}
            className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Thêm làm ông
          </button>
          <button
            type="button"
            onClick={() => onAction('FATHER')}
            className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Thêm làm bố
          </button>
          <button
            type="button"
            onClick={() => onAction('MOTHER')}
            className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Thêm làm mẹ
          </button>
          <button
            type="button"
            onClick={() => onAction('CHILD')}
            className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Thêm làm con
          </button>
        </div>
      </div>
    </div>
  );
}
