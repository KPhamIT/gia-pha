"use client";

import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import BottomSheet from "@/components/ui/BottomSheet";
import { dismissOverlayFocus } from "@/hooks/useOverlayViewport";
import PersonSearchPanel from "./PersonSearchPanel";

type SearchSheetProps = {
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
  onSelect: (person: Person) => void;
};

export default function SearchSheet({
  persons,
  relationships,
  onClose,
  onSelect,
}: SearchSheetProps) {
  const handleClose = () => {
    dismissOverlayFocus();
    onClose();
  };

  return (
    <BottomSheet onClose={handleClose} variant="search">
      <PersonSearchPanel
        persons={persons}
        relationships={relationships}
        onSelect={onSelect}
        onCancel={handleClose}
        autoFocus
      />
    </BottomSheet>
  );
}
