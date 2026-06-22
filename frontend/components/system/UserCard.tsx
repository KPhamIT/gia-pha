"use client";

import { useState } from "react";
import type {
  AuthUser,
  Organization,
  UserRole,
} from "@/components/types/family-tree-types";
import type { UpdateUserInput } from "@/lib/api/modules/users";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { systemRoleLabel } from "@/hooks/useSystemAccess";
import { useUsersAdmin } from "@/hooks/useUsersAdmin";
import IconRoundButton from "@/components/ui/IconRoundButton";
import UserForm from "./UserForm";

function roleBadgeClass(role: UserRole): string {
  if (role === "SYSTEM") return "bg-red-100 text-red-700";
  if (role === "ADMIN") return "bg-amber-100 text-amber-800";
  return "bg-neutral-100 text-neutral-600";
}

type Props = {
  mode: "system" | "org";
  user: AuthUser;
  currentUserId?: number;
  orgName?: string | null;
  organizations: Organization[];
  onUpdate: ReturnType<typeof useUsersAdmin>["update"];
  onDelete: ReturnType<typeof useUsersAdmin>["remove"];
};

export default function UserCard({
  mode,
  user,
  currentUserId,
  orgName,
  organizations,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const isOrgMode = mode === "org";
  const canEdit =
    !isOrgMode || user.role === "STANDARD" || user.id === currentUserId;
  const canDelete =
    isOrgMode && user.role === "STANDARD" && user.id !== currentUserId;

  if (editing) {
    return (
      <li className={`${BT.card} p-3 md:p-4`}>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          {user.username ?? "—"}
        </h3>
        <UserForm
          mode={mode}
          initial={user}
          organizations={organizations}
          onCancel={() => setEditing(false)}
          onSubmit={async (data) => {
            await onUpdate(user.id, data as UpdateUserInput);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  const initial = (user.username || user.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <li className={`${BT.card} flex items-start gap-3 p-3 md:p-4`}>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-100 text-lg font-semibold text-amber-800">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="min-w-0 truncate font-semibold text-neutral-900">
            {user.username ?? "—"}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}
          >
            {systemRoleLabel(user.role)}
          </span>
        </div>
        <p className={`mt-0.5 truncate text-xs ${BT.mutedOnLight}`}>
          {user.email ?? "—"}
        </p>
        {!isOrgMode ? (
          <p className={`mt-0.5 truncate text-xs ${BT.mutedOnLight}`}>
            {orgName ?? UI.SYSTEM_NO_ORG}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-1">
        {canEdit ? (
          <IconRoundButton
            icon="edit"
            variant="outline"
            iconSize={16}
            onClick={() => setEditing(true)}
            aria-label={UI.BTN_EDIT}
          />
        ) : null}
        {canDelete ? (
          <IconRoundButton
            icon="trash"
            variant="danger"
            iconSize={16}
            onClick={() => {
              if (!window.confirm(UI.ORG_USER_DELETE_CONFIRM)) return;
              void onDelete(user.id).catch(() => {
                /* toast shown in useUsersAdmin */
              });
            }}
            aria-label={UI.DELETE_PERSON}
          />
        ) : null}
      </div>
    </li>
  );
}
