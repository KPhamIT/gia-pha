"use client";

import { useMemo } from "react";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import CeremonyHeritageShell from "./CeremonyHeritageShell";
import { UI } from "@/lib/constants/ui-strings";
import type { Person, Relationship } from "@/components/types/family-tree-types";
import { personSearchSubtitle } from "@/utils/person-search";

type Props = {
  personId?: number;
  shareToken?: string;
  persons?: Person[];
  relationships?: Relationship[];
  onClose?: () => void;
  title?: string;
};

/** Xem bài cúng theo phong cách Heritage — ngày giỗ, link chia sẻ. */
export default function CeremonyHeritageExperience({
  personId,
  shareToken,
  persons = [],
  relationships = [],
  onClose,
  title = UI.CEREMONY_PRINT_TITLE,
}: Props) {
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

  return (
    <CeremonyHeritageShell
      title={title}
      onClose={onClose}
      contextLabel={
        selectedPerson || shareToken ? UI.CEREMONY_PRINT_CONTEXT_LABEL : undefined
      }
      contextName={selectedPerson?.fullName}
      contextMeta={contextMeta}
    >
      <CeremonyViewer
        personId={personId}
        shareToken={shareToken}
        variant="heritage"
      />
    </CeremonyHeritageShell>
  );
}
