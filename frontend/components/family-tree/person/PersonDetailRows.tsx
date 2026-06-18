'use client';

import IconRoundButton from '@/components/ui/IconRoundButton';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';

export function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className={`shrink-0 text-sm ${BT.mutedOnLight}`}>{label}</span>
      <span className="text-right text-sm font-medium text-neutral-900">{value || UI.NO_INFO}</span>
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
      <span className={`text-sm ${BT.mutedOnLight}`}>{label}</span>
      <div className="mt-1 flex flex-wrap gap-2">
        {persons.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onSelectPerson(person.id)}
            className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-950 active:bg-amber-200"
          >
            {person.fullName}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PersonDetailFooter({
  canEdit = false,
  onAddChild,
  onDelete,
}: {
  canEdit?: boolean;
  onAddChild: () => void;
  onDelete: () => void;
}) {
  if (!canEdit) return null;

  return (
    <div className={`sticky bottom-0 flex justify-end gap-2 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6 ${LAYOUT.pagePad}`}>
      <IconRoundButton icon="userPlus" variant="gold" label={UI.ADD_CHILD} onClick={onAddChild} />
      <IconRoundButton icon="trash" variant="danger" label={UI.DELETE_PERSON} onClick={onDelete} />
    </div>
  );
}
