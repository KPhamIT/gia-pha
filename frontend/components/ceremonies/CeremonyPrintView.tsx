"use client";

import { useMemo, useState } from "react";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import PersonSearchPanel from "@/components/family-tree/person/PersonSearchPanel";
import CeremonyHeritageShell from "./CeremonyHeritageShell";
import { UI } from "@/lib/constants/ui-strings";
import { HERITAGE_LAYOUT } from "@/lib/constants/heritage-theme";
import { personSearchSubtitle } from "@/utils/person-search";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";

type Props = {
  templateId: number;
  persons: Person[];
  relationships: Relationship[];
  onClose?: () => void;
  embedded?: boolean;
  title?: string;
  initialPersonId?: number | null;
};

function PersonHeaderButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 text-xs font-medium transition active:scale-95 hover:bg-white/15"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#c5a059] text-[10px] font-bold text-[#4a2c2a]">
        {label.charAt(0).toUpperCase()}
      </span>
      {UI.CEREMONY_PRINT_CHANGE_PERSON}
    </button>
  );
}

export default function CeremonyPrintView({
  templateId,
  persons,
  relationships,
  onClose,
  embedded = false,
  title = UI.CEREMONY_PRINT_TITLE,
  initialPersonId = null,
}: Props) {
  const [personId, setPersonId] = useState<number | null>(initialPersonId);
  const [pickingPerson, setPickingPerson] = useState(false);

  const selectedPerson = useMemo(
    () =>
      personId != null
        ? (persons.find((p) => p.id === personId) ?? null)
        : null,
    [personId, persons],
  );

  const contextMeta = selectedPerson
    ? personSearchSubtitle(selectedPerson, relationships)
    : null;

  const handleSelect = (person: Person) => {
    setPersonId(person.id);
    setPickingPerson(false);
  };

  const shellProps = {
    title,
    onClose,
    embedded,
    contextLabel: selectedPerson ? UI.CEREMONY_PRINT_CONTEXT_LABEL : undefined,
    contextName: selectedPerson?.fullName,
    contextMeta,
    headerAction:
      persons.length > 0 ? (
        <PersonHeaderButton
          label={selectedPerson?.fullName ?? "?"}
          onClick={() => setPickingPerson(true)}
        />
      ) : null,
  };

  if (persons.length === 0) {
    return (
      <CeremonyHeritageShell {...shellProps}>
        <CeremonyViewer variant="heritage" templateId={templateId} />
      </CeremonyHeritageShell>
    );
  }

  return (
    <CeremonyHeritageShell {...shellProps}>
      {personId == null && !pickingPerson ? (
        <p className="shrink-0 border-b border-stone-200 bg-stone-50 px-6 py-2 text-center text-xs text-stone-500">
          {UI.CEREMONY_PRINT_PICK_PERSON}
        </p>
      ) : null}

      <CeremonyViewer
        key={`${templateId}-${personId ?? "preview"}`}
        variant="heritage"
        templateId={templateId}
        personId={personId ?? undefined}
      />

      {pickingPerson ? (
        <div className="absolute inset-0 z-40 flex flex-col bg-[#fcf9f4]">
          <div
            className={`${HERITAGE_LAYOUT.scrollBody} flex min-h-0 flex-1 flex-col`}
          >
            <PersonSearchPanel
              persons={persons}
              relationships={relationships}
              selectedPersonId={personId}
              onSelect={handleSelect}
              onClear={() => setPersonId(null)}
              onCancel={() => setPickingPerson(false)}
              placeholder={UI.CEREMONY_PRINT_SEARCH}
              clearLabel={UI.CEREMONY_PRINT_CHANGE_PERSON}
              autoFocus
            />
          </div>
        </div>
      ) : null}
    </CeremonyHeritageShell>
  );
}
