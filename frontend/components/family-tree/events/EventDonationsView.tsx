"use client";

import { useMemo, useState } from "react";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { UI } from "@/lib/constants/ui-strings";
import type { Person } from "@/components/types/family-tree-types";
import type { FamilyEvent } from "@/components/types/event-types";
import { formatVnd } from "./event-format";
import { ET } from "./event-theme";
import { useEventDonations } from "./useEventDonations";
import DonationRow from "./DonationRow";
import EventDonationFormSheet from "./EventDonationFormSheet";

type Props = {
  event: FamilyEvent;
  persons: Person[];
  onClose: () => void;
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

/** Full-screen list of free-form merit donations (công đức) for one event. */
export default function EventDonationsView({
  event,
  persons,
  onClose,
  onEventPatched,
}: Props) {
  const {
    draftDonations,
    isDirty,
    donationTotal,
    inKindCount,
    loading,
    saving,
    upsertDraft,
    removeDraft,
    handleSave,
  } = useEventDonations({ event, onEventPatched });
  const [formOpen, setFormOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const editing = useMemo(
    () => draftDonations.find((item) => item.draftKey === editingKey) ?? null,
    [draftDonations, editingKey],
  );

  const closeForm = () => {
    setFormOpen(false);
    setEditingKey(null);
  };

  const handleClose = () => {
    if (isDirty && !window.confirm(UI.BOOK_PAGES_DISCARD_CONFIRM)) return;
    onClose();
  };

  const headerActions = (
    <div className="flex shrink-0 items-center gap-2">
      <IconRoundButton
        icon="plus"
        variant="gold"
        label={UI.BTN_CREATE}
        onClick={() => {
          setEditingKey(null);
          setFormOpen(true);
        }}
      />
      <IconRoundButton
        icon="save"
        variant="gold"
        label={UI.SAVE}
        loading={saving}
        disabled={!isDirty || saving}
        onClick={() => void handleSave()}
      />
    </div>
  );

  return (
    <>
      <FullScreenSheet
        title={UI.EVENT_DONATION_SECTION}
        onClose={handleClose}
        headerRight={headerActions}
        tone="book"
      >
        <div
          className={`border-b border-amber-400/20 bg-white py-3 text-center md:mx-6 md:mt-4 md:rounded-xl md:border md:shadow-sm ${ET.pagePad}`}
        >
          <div className={`text-xl font-bold ${ET.money}`}>
            {formatVnd(donationTotal)}
          </div>
          <div className="text-xs text-slate-500">
            {UI.EVENT_DONATION_TOTAL}
          </div>
          {draftDonations.length > 0 ? (
            <div className="mt-1 text-xs text-slate-400">
              {UI.EVENT_DONATION_SUMMARY_SUBTITLE(
                draftDonations.length,
                inKindCount,
              )}
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={36} />
          </div>
        ) : draftDonations.length === 0 ? (
          <p
            className={`py-12 text-center text-sm text-amber-100/70 ${ET.pagePad}`}
          >
            {UI.EVENT_DONATION_EMPTY}
          </p>
        ) : (
          <div className={ET.pagePad}>
            <ul className={`divide-y divide-neutral-100 ${ET.panel}`}>
              {draftDonations.map((donation) => (
                <DonationRow
                  key={donation.draftKey}
                  donation={donation}
                  onEdit={() => {
                    setEditingKey(donation.draftKey);
                    setFormOpen(true);
                  }}
                  onRemove={() => removeDraft(donation.draftKey)}
                />
              ))}
            </ul>
          </div>
        )}
      </FullScreenSheet>

      {formOpen ? (
        <EventDonationFormSheet
          initial={editing}
          persons={persons}
          onSubmit={(input) => {
            upsertDraft(input, editingKey);
            closeForm();
          }}
          onClose={closeForm}
        />
      ) : null}
    </>
  );
}
