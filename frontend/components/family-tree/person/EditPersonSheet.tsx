"use client";

import { useEffect, useState } from "react";
import type {
  PersonDetail,
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
  draftToUpdateInput,
  type PersonDraft,
} from "@/utils/person-detail-form";
import PersonDetailFields from "./PersonDetailFields";

type EditPersonSheetProps = {
  detail: PersonDetail | null;
  loading: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (data: UpdatePersonDetailInput) => void;
};

export default function EditPersonSheet({
  detail,
  loading,
  saving,
  onClose,
  onSave,
}: EditPersonSheetProps) {
  const [draft, setDraft] = useState<PersonDraft>(() =>
    buildPersonDraft(detail, "1"),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(buildPersonDraft(detail, "1"));
  }, [detail]);

  const update = (field: keyof PersonDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!draft.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }
    onSave(draftToUpdateInput(draft));
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
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size={36} label={UI.LOADING} />
        </div>
      ) : (
        <div className={`${BT.card} ${LAYOUT.pagePad} md:mx-6 md:mt-4`}>
          <PersonDetailFields draft={draft} saving={saving} onChange={update} />
        </div>
      )}
    </FullScreenSheet>
  );
}
