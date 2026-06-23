"use client";

import { useMemo, useState } from "react";
import type { PersonDetail } from "@/components/types/family-tree-types";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { extractPersonRelationships } from "@/utils/person-relationships";
import PersonDetailTabBody, {
  DETAIL_TABS,
  type DetailTab,
} from "./PersonDetailTabs";
import { PersonDetailFooter } from "./PersonDetailRows";
import PersonEditAudit from "./PersonEditAudit";

type PersonDetailSheetProps = {
  detail: PersonDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onEdit: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  onSelectPerson: (personId: number) => void;
  canEdit?: boolean;
};

export default function PersonDetailSheet({
  detail,
  loading,
  error,
  onClose,
  onEdit,
  onAddChild,
  onDelete,
  onSelectPerson,
  canEdit = false,
}: PersonDetailSheetProps) {
  const [tab, setTab] = useState<DetailTab>("info");
  const person = detail?.person;
  const relations = useMemo(
    () =>
      detail
        ? extractPersonRelationships(detail.person.id, detail.relationships)
        : null,
    [detail],
  );

  return (
    <FullScreenSheet
      title={person?.fullName ?? ""}
      onClose={onClose}
      headerRight={
        canEdit ? (
          <IconRoundButton
            icon="edit"
            variant="gold"
            label={UI.BTN_EDIT}
            onClick={onEdit}
            disabled={!person}
          />
        ) : null
      }
    >
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size={36} label={UI.LOADING} />
        </div>
      ) : error ? (
        <p className={`text-sm ${BT.error} ${LAYOUT.pagePad}`}>{error}</p>
      ) : person ? (
        <>
          <div className={`${BT.card} md:mx-6 md:mt-4`}>
            <div
              className={`border-b ${BT.dividerOnLight} ${LAYOUT.pagePad} py-3`}
            >
              {person.generation != null ? (
                <p className={`text-sm ${BT.mutedOnLight}`}>
                  {UI.GENERATION_ORDINAL(person.generation)}
                </p>
              ) : null}
              <div className="mt-2">
                <PersonEditAudit
                  updatedAt={person.updatedAt}
                  lastEditedBy={person.lastEditedBy}
                  editHistory={detail.editHistory}
                />
              </div>
            </div>

            <nav
              className={`scrollbar-hide flex overflow-x-auto border-b ${BT.dividerOnLight}`}
            >
              {DETAIL_TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 px-4 py-3 text-sm font-medium transition md:px-6 ${
                    tab === item.id ? BT.tabActive : BT.tabIdle
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className={LAYOUT.pagePad}>
              <PersonDetailTabBody
                tab={tab}
                person={person}
                relations={relations}
                onSelectPerson={onSelectPerson}
              />
            </div>
          </div>

          <PersonDetailFooter
            canEdit={canEdit}
            onAddChild={onAddChild}
            onDelete={onDelete}
          />
        </>
      ) : null}
    </FullScreenSheet>
  );
}
