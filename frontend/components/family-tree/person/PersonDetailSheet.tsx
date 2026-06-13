'use client';

import { useMemo, useState } from 'react';
import type { PersonDetail } from '@/components/types/family-tree-types';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { extractPersonRelationships } from '@/utils/person-relationships';
import PersonDetailTabBody, { DETAIL_TABS, type DetailTab } from './PersonDetailTabs';
import { PersonDetailFooter } from './PersonDetailRows';

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
            {DETAIL_TABS.map((item) => (
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
            <PersonDetailTabBody tab={tab} person={person} relations={relations} onSelectPerson={onSelectPerson} />
          </div>

          <PersonDetailFooter onAddChild={onAddChild} onDelete={onDelete} />
        </>
      ) : null}
    </FullScreenSheet>
  );
}
