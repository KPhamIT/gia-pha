'use client';

import type { Person, Relationship } from '@/components/types/family-tree-types';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';
import IconRoundButton from '@/components/ui/IconRoundButton';
import PersonSearchPanel from '@/components/family-tree/person/PersonSearchPanel';

type Props = {
  persons: Person[];
  relationships: Relationship[];
  personId: number | null;
  onSelectPerson: (id: number | null) => void;
  saving: boolean;
  message: string | null;
  error: string | null;
  onSave: () => void;
};

/** "Liên kết thành viên" — link the account to a person in the tree. */
export default function AccountLinkSection({ persons, relationships, personId, onSelectPerson, saving, message, error, onSave }: Props) {
  return (
    <section className={`${BT.card} space-y-3 p-4`}>
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">{UI.ACCOUNT_LINK_PERSON}</h2>
        <p className={`mt-1 text-xs ${BT.mutedOnLight}`}>{UI.ACCOUNT_LINK_PERSON_HINT}</p>
      </div>
      <PersonSearchPanel
        persons={persons}
        relationships={relationships}
        selectedPersonId={personId}
        onSelect={(item) => onSelectPerson(item.id)}
        onClear={() => onSelectPerson(null)}
        clearLabel={UI.ACCOUNT_CLEAR_LINK}
        listClassName="max-h-52 overflow-y-auto rounded-xl border border-amber-100 bg-amber-50/30 px-1 py-1"
      />
      <div className="flex justify-end">
        <IconRoundButton icon="save" variant="gold" loading={saving} label={UI.SAVE} onClick={onSave} />
      </div>
      {message ? <p className={`text-sm font-medium ${BT.gold}`}>{message}</p> : null}
      {error ? <p className={BT.errorBgLight}>{error}</p> : null}
    </section>
  );
}
