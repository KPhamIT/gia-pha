"use client";

import { useState } from "react";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import PersonSearchPanel from "@/components/family-tree/person/PersonSearchPanel";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";

type Props = {
  templateId: number;
  persons: Person[];
  relationships: Relationship[];
  demo?: boolean;
};

/** Chọn người đã mất rồi xem + in bài cúng với dữ liệu thật của họ. */
export default function CeremonyPrintView({
  templateId,
  persons,
  relationships,
  demo = false,
}: Props) {
  const [personId, setPersonId] = useState<number | null>(null);

  if (persons.length === 0) {
    return (
      <p className={`text-sm ${BT.mutedOnDark}`}>
        {UI.CEREMONY_PRINT_NO_PERSONS}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`${BT.card} p-3`}>
        <PersonSearchPanel
          persons={persons}
          relationships={relationships}
          selectedPersonId={personId}
          onSelect={(item) => setPersonId(item.id)}
          onClear={() => setPersonId(null)}
          placeholder={UI.CEREMONY_PRINT_SEARCH}
          clearLabel={UI.CEREMONY_PRINT_CHANGE_PERSON}
          listClassName="max-h-60 overflow-y-auto rounded-xl border border-amber-100 bg-amber-50/30 px-1 py-1"
        />
      </div>
      {personId != null ? (
        <CeremonyViewer
          personId={personId}
          templateId={templateId}
          demo={demo}
        />
      ) : (
        <p className={`text-sm ${BT.mutedOnDark}`}>
          {UI.CEREMONY_PRINT_PICK_PERSON}
        </p>
      )}
    </div>
  );
}
