'use client';

import type { PersonDetailPerson, PersonRelationships } from '@/components/types/family-tree-types';
import { UI } from '@/lib/constants/ui-strings';
import { formatDate } from '@/utils/person-relationships';
import { InfoRow, RelationRow } from './PersonDetailRows';

export type DetailTab = 'info' | 'relationships' | 'biography' | 'grave';

export const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: 'info', label: UI.PERSON_INFO },
  { id: 'relationships', label: UI.RELATIONSHIPS },
  { id: 'biography', label: UI.BIOGRAPHY },
  { id: 'grave', label: UI.GRAVE_INFO },
];

type PersonDetailTabBodyProps = {
  tab: DetailTab;
  person: PersonDetailPerson;
  relations: PersonRelationships | null;
  onSelectPerson: (personId: number) => void;
};

export default function PersonDetailTabBody({ tab, person, relations, onSelectPerson }: PersonDetailTabBodyProps) {
  if (tab === 'info') {
    return (
      <div className="divide-y divide-slate-100">
        <InfoRow label={UI.GENDER} value={person.gender} />
        <InfoRow label={UI.BIRTH_DATE} value={formatDate(person.birthDate) || UI.BIRTH_DATE_UNKNOWN} />
        <InfoRow
          label={UI.DECEASED_STATUS}
          value={person.deceased || person.deathDate ? UI.STATUS_DECEASED : UI.STATUS_ALIVE}
        />
        <InfoRow label={UI.DEATH_DATE} value={formatDate(person.deathDate)} />
        <InfoRow label={UI.BIRTH_PLACE} value={person.birthPlace} />
        <InfoRow label={UI.CURRENT_LOCATION} value={person.currentLocation} />
        <InfoRow label={UI.EDUCATION} value={person.education} />
        <InfoRow label={UI.OCCUPATION} value={person.occupation} />
        <InfoRow label={UI.RELIGION} value={person.religion} />
        <InfoRow label={UI.ETHNICITY} value={person.ethnicity} />
        <InfoRow label={UI.ACHIEVEMENTS} value={person.achievements} />
      </div>
    );
  }

  if (tab === 'relationships' && relations) {
    return (
      <div className="divide-y divide-slate-100">
        <RelationRow label={UI.FATHER} persons={relations.father ? [relations.father] : []} onSelectPerson={onSelectPerson} />
        <RelationRow label={UI.MOTHER} persons={relations.mother ? [relations.mother] : []} onSelectPerson={onSelectPerson} />
        <RelationRow label={UI.SPOUSE} persons={relations.spouses} onSelectPerson={onSelectPerson} />
        <RelationRow label={UI.CHILDREN} persons={relations.children} onSelectPerson={onSelectPerson} />
      </div>
    );
  }

  if (tab === 'biography') {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {person.biography?.content || UI.NO_BIOGRAPHY}
      </p>
    );
  }

  if (tab === 'grave') {
    return person.graveInfo ? (
      <div className="divide-y divide-slate-100">
        <InfoRow label={UI.CEMETERY} value={person.graveInfo.cemetery} />
        <InfoRow label={UI.GRAVE_ADDRESS} value={person.graveInfo.address} />
        <InfoRow label={UI.GRAVE_NOTES} value={person.graveInfo.notes} />
      </div>
    ) : (
      <p className="text-sm text-slate-500">{UI.NO_GRAVE_INFO}</p>
    );
  }

  return null;
}
