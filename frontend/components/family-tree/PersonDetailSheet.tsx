'use client';

import { useMemo, useState } from 'react';
import type { PersonDetail } from '@/components/types/family-tree-types';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { extractPersonRelationships, formatDate } from '@/utils/person-relationships';

type DetailTab = 'info' | 'relationships' | 'biography' | 'grave';

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'info', label: UI.PERSON_INFO },
  { id: 'relationships', label: UI.RELATIONSHIPS },
  { id: 'biography', label: UI.BIOGRAPHY },
  { id: 'grave', label: UI.GRAVE_INFO },
];

type PersonDetailSheetProps = {
  detail: PersonDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onEdit: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  onSelectPerson: (personId: number) => void;
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="shrink-0 text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value || UI.NO_INFO}</span>
    </div>
  );
}

function RelationRow({
  label,
  persons,
  onSelectPerson,
}: {
  label: string;
  persons: { id: number; fullName: string }[];
  onSelectPerson: (personId: number) => void;
}) {
  if (persons.length === 0) {
    return <InfoRow label={label} value={null} />;
  }

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

export default function PersonDetailSheet({
  detail,
  loading,
  error,
  onClose,
  onEdit,
  onAddChild,
  onDelete,
  onSelectPerson,
}: PersonDetailSheetProps) {
  const [tab, setTab] = useState<DetailTab>('info');
  const person = detail?.person;
  const relations = useMemo(
    () => (detail ? extractPersonRelationships(detail.person.id, detail.relationships) : null),
    [detail],
  );

  return (
    <FullScreenSheet
      title={person?.fullName ?? ''}
      onClose={onClose}
      headerRight={
        <button
          type="button"
          onClick={onEdit}
          className="grid h-10 w-10 place-items-center rounded-full text-slate-600 active:bg-slate-100"
          aria-label={UI.EDIT_PERSON}
          disabled={!person}
        >
          <Icon path="edit" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
      }
    >
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size={36} label={UI.LOADING} />
        </div>
      ) : error ? (
        <p className="p-4 text-sm text-red-600">{error}</p>
      ) : person ? (
        <>
          <div className="border-b border-slate-200 px-4 py-3">
            {person.generation != null ? (
              <p className="text-sm text-slate-500">Đời thứ {person.generation}</p>
            ) : null}
          </div>

          <nav className="flex overflow-x-auto border-b border-slate-200">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 px-4 py-3 text-sm font-medium transition ${
                  tab === item.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 active:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-4 py-4">
            {tab === 'info' ? (
              <div className="divide-y divide-slate-100">
                <InfoRow label={UI.GENDER} value={person.gender} />
                <InfoRow label={UI.BIRTH_DATE} value={formatDate(person.birthDate) || UI.BIRTH_DATE_UNKNOWN} />
                <InfoRow label={UI.DEATH_DATE} value={formatDate(person.deathDate)} />
                <InfoRow label={UI.BIRTH_PLACE} value={person.birthPlace} />
                <InfoRow label={UI.CURRENT_LOCATION} value={person.currentLocation} />
                <InfoRow label={UI.EDUCATION} value={person.education} />
                <InfoRow label={UI.OCCUPATION} value={person.occupation} />
                <InfoRow label={UI.RELIGION} value={person.religion} />
                <InfoRow label={UI.ETHNICITY} value={person.ethnicity} />
                <InfoRow label={UI.ACHIEVEMENTS} value={person.achievements} />
              </div>
            ) : null}

            {tab === 'relationships' && relations ? (
              <div className="divide-y divide-slate-100">
                <RelationRow
                  label={UI.FATHER}
                  persons={relations.father ? [relations.father] : []}
                  onSelectPerson={onSelectPerson}
                />
                <RelationRow
                  label={UI.MOTHER}
                  persons={relations.mother ? [relations.mother] : []}
                  onSelectPerson={onSelectPerson}
                />
                <RelationRow label={UI.SPOUSE} persons={relations.spouses} onSelectPerson={onSelectPerson} />
                <RelationRow label={UI.CHILDREN} persons={relations.children} onSelectPerson={onSelectPerson} />
              </div>
            ) : null}

            {tab === 'biography' ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {person.biography?.content || UI.NO_BIOGRAPHY}
              </p>
            ) : null}

            {tab === 'grave' ? (
              person.graveInfo ? (
                <div className="divide-y divide-slate-100">
                  <InfoRow label={UI.CEMETERY} value={person.graveInfo.cemetery} />
                  <InfoRow label={UI.GRAVE_ADDRESS} value={person.graveInfo.address} />
                  <InfoRow label={UI.GRAVE_NOTES} value={person.graveInfo.notes} />
                </div>
              ) : (
                <p className="text-sm text-slate-500">{UI.NO_GRAVE_INFO}</p>
              )
            ) : null}
          </div>

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
        </>
      ) : null}
    </FullScreenSheet>
  );
}
