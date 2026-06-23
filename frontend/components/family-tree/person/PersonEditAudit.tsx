"use client";

import type { PersonEditHistoryEntry } from "@/components/types/family-tree-types";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { formatDateTime } from "@/utils/person-relationships";

type Props = {
  updatedAt?: string | null;
  lastEditedBy?: { id: number; displayName: string } | null;
  editHistory?: PersonEditHistoryEntry[];
};

export default function PersonEditAudit({
  updatedAt,
  lastEditedBy,
  editHistory = [],
}: Props) {
  const editorName =
    lastEditedBy?.displayName ?? editHistory[0]?.displayName ?? null;
  const editedAt = updatedAt ?? editHistory[0]?.editedAt ?? null;

  if (!editorName || !editedAt) return null;

  return (
    <div className={`space-y-2 ${BT.mutedOnLight}`}>
      <p className="text-xs">
        {UI.PERSON_LAST_EDITED_BY(editorName, formatDateTime(editedAt))}
      </p>
      {editHistory.length > 1 ? (
        <details className="text-xs">
          <summary className="cursor-pointer select-none font-medium text-amber-800">
            {UI.PERSON_EDIT_HISTORY}
          </summary>
          <ul className="mt-2 space-y-1 border-l border-amber-200/80 pl-3">
            {editHistory.map((entry) => (
              <li key={`${entry.userId}-${entry.editedAt}`}>
                {entry.displayName} · {formatDateTime(entry.editedAt)}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
