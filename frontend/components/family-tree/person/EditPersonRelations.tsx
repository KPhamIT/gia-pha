"use client";

import { useState } from "react";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import { UI } from "@/lib/constants/ui-strings";
import type { Person, Relationship } from "@/components/types/family-tree-types";
import {
  personById,
  type PersonRelationDraft,
} from "@/utils/person-edit-relations";
import {
  createRelatedPerson,
  type RelatedPersonRole,
} from "@/lib/family-tree/create-related-person";
import { notify } from "@/lib/notify";
import PersonRelationPicker from "./PersonRelationPicker";
import AddRelatedPersonForm from "./AddRelatedPersonForm";

type Props = {
  subject: Person;
  persons: Person[];
  draft: PersonRelationDraft;
  disabled?: boolean;
  onChange: (patch: Partial<PersonRelationDraft>) => void;
  onPersonCreated: (person: Person, relationship: Relationship) => void;
};

function spouseAddLabel(subject: Person): string {
  if (subject.gender?.trim() === "Nam") return UI.RELATION_ADD_WIFE;
  if (subject.gender?.trim() === "Nữ") return UI.RELATION_ADD_HUSBAND;
  return UI.RELATION_ADD_SPOUSE;
}

function defaultGenderForRole(
  role: RelatedPersonRole,
  subject: Person,
): string {
  if (role === "father") return UI.GENDER_MALE;
  if (role === "mother") return UI.GENDER_FEMALE;
  if (subject.gender?.trim() === "Nam") return UI.GENDER_FEMALE;
  if (subject.gender?.trim() === "Nữ") return UI.GENDER_MALE;
  return "";
}

function draftKeyForRole(
  role: RelatedPersonRole,
): keyof PersonRelationDraft {
  if (role === "father") return "fatherId";
  if (role === "mother") return "motherId";
  return "spouseId";
}

/** Editable Cha / Mẹ / Vợ-Chồng block inside the person edit sheet. */
export default function EditPersonRelations({
  subject,
  persons,
  draft,
  disabled,
  onChange,
  onPersonCreated,
}: Props) {
  const [addingRole, setAddingRole] = useState<RelatedPersonRole | null>(null);
  const excludeBase = [subject.id];

  const handleCreate = async (
    role: RelatedPersonRole,
    data: { fullName: string; gender: string; birthDate: string },
  ) => {
    try {
      const { person, relationship } = await createRelatedPerson(
        subject,
        role,
        data,
      );
      onPersonCreated(person, relationship);
      onChange({ [draftKeyForRole(role)]: person.id });
      setAddingRole(null);
      notify.success(UI.TOAST_PERSON_CREATED);
    } catch (error) {
      notify.error(error, UI.ERR_CREATE_PERSON);
      throw error;
    }
  };

  return (
    <CollapsibleSection title={UI.RELATIONSHIPS} defaultOpen>
      <PersonRelationPicker
        label={UI.FATHER}
        persons={persons}
        excludeIds={[excludeBase[0], draft.motherId, draft.spouseId].filter(
          (id): id is number => id != null,
        )}
        selected={personById(persons, draft.fatherId)}
        disabled={disabled}
        addLabel={UI.RELATION_ADD_FATHER}
        onSelect={(p) => onChange({ fatherId: p.id })}
        onClear={() => onChange({ fatherId: null })}
        onAddClick={() => setAddingRole("father")}
      />
      {addingRole === "father" ? (
        <AddRelatedPersonForm
          role="father"
          defaultGender={defaultGenderForRole("father", subject)}
          disabled={disabled}
          onCancel={() => setAddingRole(null)}
          onSubmit={(data) => handleCreate("father", data)}
        />
      ) : null}

      <PersonRelationPicker
        label={UI.MOTHER}
        persons={persons}
        excludeIds={[excludeBase[0], draft.fatherId, draft.spouseId].filter(
          (id): id is number => id != null,
        )}
        selected={personById(persons, draft.motherId)}
        disabled={disabled}
        addLabel={UI.RELATION_ADD_MOTHER}
        onSelect={(p) => onChange({ motherId: p.id })}
        onClear={() => onChange({ motherId: null })}
        onAddClick={() => setAddingRole("mother")}
      />
      {addingRole === "mother" ? (
        <AddRelatedPersonForm
          role="mother"
          defaultGender={defaultGenderForRole("mother", subject)}
          disabled={disabled}
          onCancel={() => setAddingRole(null)}
          onSubmit={(data) => handleCreate("mother", data)}
        />
      ) : null}

      <PersonRelationPicker
        label={UI.SPOUSE}
        persons={persons}
        excludeIds={[excludeBase[0], draft.fatherId, draft.motherId].filter(
          (id): id is number => id != null,
        )}
        selected={personById(persons, draft.spouseId)}
        disabled={disabled}
        addLabel={spouseAddLabel(subject)}
        onSelect={(p) => onChange({ spouseId: p.id })}
        onClear={() => onChange({ spouseId: null })}
        onAddClick={() => setAddingRole("spouse")}
      />
      {addingRole === "spouse" ? (
        <AddRelatedPersonForm
          role="spouse"
          defaultGender={defaultGenderForRole("spouse", subject)}
          disabled={disabled}
          onCancel={() => setAddingRole(null)}
          onSubmit={(data) => handleCreate("spouse", data)}
        />
      ) : null}
    </CollapsibleSection>
  );
}
