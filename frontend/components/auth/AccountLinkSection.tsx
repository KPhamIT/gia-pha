"use client";

import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import { UI } from "@/lib/constants/ui-strings";
import IconRoundButton from "@/components/ui/IconRoundButton";
import PersonSearchPanel from "@/components/family-tree/person/PersonSearchPanel";
import { AC } from "./account-theme";

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

export default function AccountLinkSection({
  persons,
  relationships,
  personId,
  onSelectPerson,
  saving,
  message,
  error,
  onSave,
}: Props) {
  return (
    <section className={`${AC.card} space-y-4 p-5 md:p-6`}>
      <div>
        <h2 className={AC.sectionTitle}>{UI.ACCOUNT_LINK_PERSON}</h2>
        <p className={`mt-1 text-sm ${AC.muted}`}>{UI.ACCOUNT_LINK_PERSON_HINT}</p>
      </div>
      <PersonSearchPanel
        persons={persons}
        relationships={relationships}
        selectedPersonId={personId}
        onSelect={(item) => onSelectPerson(item.id)}
        onClear={() => onSelectPerson(null)}
        clearLabel={UI.ACCOUNT_CLEAR_LINK}
        listClassName="max-h-52 overflow-y-auto rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] px-1 py-1"
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95 disabled:opacity-60"
        >
          {UI.ACCOUNT_SAVE_LINK}
        </button>
      </div>
      {message ? (
        <p className="text-sm font-medium text-[#944a00]">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]">
          {error}
        </p>
      ) : null}
    </section>
  );
}
