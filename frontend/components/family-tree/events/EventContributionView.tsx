"use client";

import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { UI } from "@/lib/constants/ui-strings";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import type { FamilyEvent } from "@/components/types/event-types";
import { isFullyPaid } from "./event-contribution-utils";
import { useEventContributions } from "./useEventContributions";
import ContributionFamilyCard from "./ContributionFamilyCard";
import ContributionSummaryStats from "./ContributionSummaryStats";
import { CT } from "./contribution-theme";
import { ET } from "./event-theme";

type Props = {
  event: FamilyEvent;
  persons: Person[];
  relationships: Relationship[];
  canEdit?: boolean;
  onClose: () => void;
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

export default function EventContributionView({
  event,
  persons,
  relationships,
  canEdit = false,
  onClose,
  onEventPatched,
}: Props) {
  const {
    groups,
    livingCount,
    livingPaidCount,
    contributionTotal,
    loading,
    saving,
    isDirty,
    getAmount,
    inputValueFor,
    setInputText,
    toggleFullPaid,
    commitInput,
    handleSave,
  } = useEventContributions({ event, persons, relationships, onEventPatched });

  const handleClose = () => {
    if (isDirty && !window.confirm(UI.BOOK_PAGES_DISCARD_CONFIRM)) return;
    onClose();
  };

  const saveButton = canEdit ? (
    <IconRoundButton
      icon="save"
      variant="gold"
      label={UI.SAVE}
      loading={saving}
      disabled={!isDirty || saving}
      onClick={() => void handleSave()}
    />
  ) : null;

  return (
    <FullScreenSheet
      title={event.title}
      onClose={handleClose}
      headerRight={saveButton}
      tone="heritage"
    >
      <div className={ET.pagePad}>
        <ContributionSummaryStats
          paidCount={livingPaidCount}
          unpaidCount={livingCount - livingPaidCount}
          totalCollected={contributionTotal}
          amountPerPerson={event.amountPerPerson}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size={36} />
        </div>
      ) : livingCount === 0 ? (
        <p className={`px-4 py-12 text-center text-sm ${CT.mutedOnShell}`}>
          {UI.EVENT_NO_MEMBERS}
        </p>
      ) : (
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${ET.pagePad} pt-0`}>
          {groups.map((group) => {
            const groupPaid = group.members.filter((m) =>
              isFullyPaid(getAmount(m.id), event.amountPerPerson),
            ).length;
            return (
              <ContributionFamilyCard
                key={group.key}
                group={group}
                groupPaid={groupPaid}
                amountPerPerson={event.amountPerPerson}
                canEdit={canEdit}
                saving={saving}
                getAmount={getAmount}
                inputValueFor={inputValueFor}
                onToggle={toggleFullPaid}
                onInputChange={setInputText}
                onCommit={commitInput}
              />
            );
          })}
        </div>
      )}
    </FullScreenSheet>
  );
}
