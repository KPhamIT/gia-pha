"use client";

import { useEffect, useState } from "react";
import type {
  Person,
  PersonDetail,
  Relationship,
  UpdatePersonDetailInput,
} from "@/components/types/family-tree-types";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import {
  buildPersonDraft,
  clearDeceasedDraftFields,
  draftToUpdateInput,
  type PersonDraft,
} from "@/utils/person-detail-form";
import {
  buildRelationDraft,
  type PersonRelationDraft,
} from "@/utils/person-edit-relations";
import PersonDetailFields from "./PersonDetailFields";
import EditPersonRelations from "./EditPersonRelations";

export type EditPersonSavePayload = {
  detail: UpdatePersonDetailInput;
  relations: PersonRelationDraft;
};

type EditPersonSheetProps = {
  detail: PersonDetail | null;
  persons: Person[];
  relationships: Relationship[];
  loading: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: EditPersonSavePayload) => void;
  onPersonCreated: (person: Person, relationship: Relationship) => void;
};

export default function EditPersonSheet({
  detail,
  persons,
  relationships,
  loading,
  saving,
  onClose,
  onSave,
  onPersonCreated,
}: EditPersonSheetProps) {
  const person = detail?.person ?? null;
  const personId = person?.id ?? null;
  const [draft, setDraft] = useState<PersonDraft>(() =>
    buildPersonDraft(detail, "1"),
  );
  const [relations, setRelations] = useState<PersonRelationDraft>(() =>
    personId != null
      ? buildRelationDraft(personId, relationships)
      : { fatherId: null, motherId: null, spouseId: null },
  );

  useEffect(() => {
    // Chỉ reset khi đổi người / reload detail. Không phụ thuộc `relationships`
    // của cây — thêm cha/mẹ/vợ trong form cập nhật cây ngay; nếu rebuild từ
    // detail.relationships cũ sẽ xóa ID vừa chọn và lần Lưu sẽ gỡ liên kết.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(buildPersonDraft(detail, "1"));
    if (detail?.person.id != null) {
      setRelations(
        buildRelationDraft(
          detail.person.id,
          detail.relationships.length
            ? detail.relationships
            : relationships,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- xem ghi chú trên
  }, [detail]);

  const update = (field: keyof PersonDraft, value: string) => {
    setDraft((prev) => {
      if (field === "deceased" && value !== "1") {
        return clearDeceasedDraftFields(prev);
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    if (!draft.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }
    onSave({
      detail: draftToUpdateInput(draft),
      relations,
    });
  };

  const saveButton = (
    <IconRoundButton
      icon="save"
      variant="gold"
      loading={saving}
      label={UI.SAVE}
      onClick={handleSave}
    />
  );

  return (
    <FullScreenSheet
      title={UI.EDIT_PERSON}
      onClose={onClose}
      headerRight={saveButton}
    >
      {loading || !person ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size={36} label={UI.LOADING} />
        </div>
      ) : (
        <div className={`${BT.card} ${LAYOUT.pagePad} md:mx-6 md:mt-4`}>
          <PersonDetailFields draft={draft} saving={saving} onChange={update} />
          <EditPersonRelations
            subject={person}
            persons={persons}
            draft={relations}
            disabled={saving}
            onChange={(patch) =>
              setRelations((prev) => ({ ...prev, ...patch }))
            }
            onPersonCreated={onPersonCreated}
          />
        </div>
      )}
    </FullScreenSheet>
  );
}
