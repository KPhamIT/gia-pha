'use client';

import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';

export function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="shrink-0 text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value || UI.NO_INFO}</span>
    </div>
  );
}

export function RelationRow({ label, persons, onSelectPerson }: {
  label: string;
  persons: { id: number; fullName: string }[];
  onSelectPerson: (personId: number) => void;
}) {
  if (persons.length === 0) return <InfoRow label={label} value={null} />;
  return (
    <div className="py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="mt-1 flex flex-wrap gap-2">
        {persons.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onSelectPerson(person.id)}
            className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 active:bg-blue-100"
          >
            {person.fullName}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PersonDetailFooter({ onAddChild, onDelete }: { onAddChild: () => void; onDelete: () => void }) {
  return (
    <div className="sticky bottom-0 flex gap-3 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onAddChild}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white active:bg-green-700"
      >
        <Icon path="userPlus" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        {UI.ADD_CHILD}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 active:bg-red-100"
        aria-label={UI.DELETE_PERSON}
      >
        <Icon path="trash" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>
    </div>
  );
}
