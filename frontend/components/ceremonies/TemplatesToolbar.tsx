"use client";

import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import IconRoundButton from "@/components/ui/IconRoundButton";

type Props = {
  canEdit: boolean;
  onCreate: () => void;
};

export default function TemplatesToolbar({ canEdit, onCreate }: Props) {
  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-amber-100/10 bg-gradient-to-b from-amber-950 via-amber-950/98 to-amber-950/90 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-xs leading-snug sm:max-w-[min(100%,28rem)] sm:text-sm ${BT.mutedOnDark}`}
        >
          {canEdit
            ? UI.CEREMONY_TEMPLATE_HINT
            : UI.CEREMONY_TEMPLATE_READONLY_HINT}
        </p>
        {canEdit ? (
          <IconRoundButton
            icon="plus"
            variant="gold"
            label={UI.CEREMONY_TEMPLATE_CREATE}
            onClick={onCreate}
            className="w-full shrink-0 sm:w-auto"
          />
        ) : null}
      </div>
    </div>
  );
}
