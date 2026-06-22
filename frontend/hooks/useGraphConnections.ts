"use client";

import { useCallback, useState } from "react";
import type { Connection, FinalConnectionState } from "@xyflow/react";
import type {
  Person,
  Relationship,
  RelationshipType,
} from "@/components/types/family-tree-types";
import {
  createChildPerson,
  createRelationship,
} from "@/lib/family-tree/mutations";
import { getErrorMessage } from "@/utils/errors";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";

type Args = {
  onPersonAdded?: (person: Person, relationship: Relationship) => void;
  onRelationshipAdded?: (relationship: Relationship) => void;
  assertCanMutate?: () => boolean;
};

/** Drag-to-connect interactions: pending relationship modal + child-on-drop. */
export function useGraphConnections({
  onPersonAdded,
  onRelationshipAdded,
  assertCanMutate,
}: Args) {
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );
  const [pendingType, setPendingType] = useState<RelationshipType>("CHILD");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const onConnect = useCallback((connection: Connection) => {
    setSaveError(null);
    setPendingConnection(connection);
    setPendingType("CHILD");
  }, []);

  const cancelConnection = useCallback(() => {
    setPendingConnection(null);
    setSaveError(null);
  }, []);

  const confirmConnection = useCallback(async () => {
    if (!pendingConnection) return;
    if (assertCanMutate && !assertCanMutate()) return;

    const fromId = Number(pendingConnection.source);
    const toId = Number(pendingConnection.target);

    try {
      setSaving(true);
      setSaveError(null);
      const relationship = await createRelationship(fromId, toId, pendingType);
      onRelationshipAdded?.(relationship);
      setPendingConnection(null);
      notify.success(UI.TOAST_RELATIONSHIP_SAVED);
    } catch (error) {
      notify.error(error, UI.ERR_SAVE_RELATIONSHIP);
      setSaveError(getErrorMessage(error, UI.ERR_SAVE_RELATIONSHIP));
    } finally {
      setSaving(false);
    }
  }, [assertCanMutate, onRelationshipAdded, pendingConnection, pendingType]);

  const onConnectEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent,
      connectionState: FinalConnectionState,
    ) => {
      if (connectionState.isValid || !connectionState.fromNode) return;
      const parentPerson = connectionState.fromNode.data.person as Person;

      void (async () => {
        if (assertCanMutate && !assertCanMutate()) return;
        try {
          const result = await createChildPerson(parentPerson, {
            fullName: UI.DEFAULT_NEW_PERSON,
          });
          onPersonAdded?.(result.person, result.relationship);
          notify.success(UI.TOAST_CHILD_CREATED);
        } catch (error) {
          notify.error(error, UI.ERR_CREATE_PERSON);
          setSaveError(getErrorMessage(error, UI.ERR_CREATE_PERSON));
        }
      })();
    },
    [assertCanMutate, onPersonAdded],
  );

  return {
    pendingConnection,
    pendingType,
    setPendingType,
    saving,
    saveError,
    onConnect,
    onConnectEnd,
    confirmConnection,
    cancelConnection,
  };
}
