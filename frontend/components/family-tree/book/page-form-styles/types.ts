import type { ReactElement } from "react";
import type { PersonRelationships } from "@/components/types/family-tree-types";
import type { BookPageDraft } from "../book-page-draft";

export type PageFormProps = {
  draft: BookPageDraft;
  relations: PersonRelationships | null;
  readOnly: boolean;
  onChange: (field: keyof BookPageDraft, value: string) => void;
  onStartEdit?: () => void;
};

export type PageFormComponent = (props: PageFormProps) => ReactElement;

export type PageFormStyle = {
  id: string;
  label: string;
  Component: PageFormComponent;
};
