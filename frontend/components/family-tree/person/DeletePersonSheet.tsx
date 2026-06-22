"use client";

import type { Person } from "@/components/types/family-tree-types";
import BottomSheet from "@/components/ui/BottomSheet";
import Icon from "@/components/icons/Icon";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

type DeletePersonSheetProps = {
  person: Person;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeletePersonSheet({
  person,
  loading = false,
  onClose,
  onConfirm,
}: DeletePersonSheetProps) {
  return (
    <BottomSheet onClose={onClose} maxWidth="md" zClass="z-[60]">
      <div className={LAYOUT.pagePad}>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-800">
            <Icon
              path="alertTriangle"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {UI.DELETE_PERSON_CONFIRM(person.fullName)}
            </p>
            <p className={`text-xs ${BT.mutedOnLight}`}>
              {UI.DELETE_IRREVERSIBLE}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <IconRoundButton
            icon="close"
            variant="outline"
            label={UI.CANCEL}
            onClick={onClose}
            disabled={loading}
          />
          <IconRoundButton
            icon="trash"
            variant="danger"
            label={UI.DELETE_PERSON}
            onClick={onConfirm}
            disabled={loading}
          />
        </div>
      </div>
    </BottomSheet>
  );
}
