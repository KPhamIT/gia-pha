"use client";

import { useState, type ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import type {
  AuthUser,
  Organization,
  UserRole,
} from "@/components/types/family-tree-types";
import type { UpdateUserInput } from "@/lib/api/modules/users";
import { AC } from "@/components/auth/account-theme";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { systemRoleLabel } from "@/hooks/useSystemAccess";
import { useUsersAdmin } from "@/hooks/useUsersAdmin";
import IconRoundButton from "@/components/ui/IconRoundButton";
import UserForm from "./UserForm";

function roleBadgeClass(role: UserRole, landing: boolean): string {
  if (landing) {
    if (role === "SYSTEM") return "bg-[#ffdad6] text-[#93000a]";
    if (role === "ADMIN") return "bg-[#ffdcc5] text-[#301400]";
    return "bg-[#f0ede9] text-[#504443]";
  }
  if (role === "SYSTEM") return "bg-red-100 text-red-700";
  if (role === "ADMIN") return "bg-amber-100 text-amber-800";
  return "bg-neutral-100 text-neutral-600";
}

type Props = {
  mode: "system" | "org";
  variant?: "book" | "landing";
  user: AuthUser;
  currentUserId?: number;
  deletableRoles?: UserRole[];
  orgName?: string | null;
  organizations: Organization[];
  onUpdate: ReturnType<typeof useUsersAdmin>["update"];
  onDelete: ReturnType<typeof useUsersAdmin>["remove"];
};

export default function UserCard({
  mode,
  variant = "book",
  user,
  currentUserId,
  deletableRoles,
  orgName,
  organizations,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const isLanding = variant === "landing";
  const isOrgMode = mode === "org";
  const canEdit =
    !isOrgMode || user.role === "STANDARD" || user.id === currentUserId;
  const canDelete =
    user.id !== currentUserId &&
    (isOrgMode
      ? user.role === "STANDARD"
      : deletableRoles
        ? deletableRoles.includes(user.role)
        : user.role !== "SYSTEM");

  const cardClass = isLanding ? AC.card : BT.card;

  if (editing) {
    return (
      <li className={`${cardClass} p-3 md:p-4`}>
        <h3
          className={`mb-3 text-sm font-semibold ${
            isLanding ? "text-[#321716]" : "text-neutral-900"
          }`}
        >
          {user.username ?? "—"}
        </h3>
        <UserForm
          mode={mode}
          initial={user}
          fixedRole={deletableRoles?.[0]}
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
    <li className={`${cardClass} flex items-start gap-3 p-3 md:p-4`}>
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-semibold ${
          isLanding
            ? "border border-[#944a00]/30 bg-[#ffdcc5] text-[#301400]"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p
            className={`min-w-0 truncate font-semibold ${
              isLanding ? "text-[#321716]" : "text-neutral-900"
            }`}
          >
            {user.username ?? "—"}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeClass(user.role, isLanding)}`}
          >
            {systemRoleLabel(user.role)}
          </span>
        </div>
        <p
          className={`mt-0.5 truncate text-xs ${
            isLanding ? AC.muted : BT.mutedOnLight
          }`}
        >
          {user.email ?? "—"}
        </p>
        {!isOrgMode ? (
          <p
            className={`mt-0.5 truncate text-xs ${
              isLanding ? AC.muted : BT.mutedOnLight
            }`}
          >
            {orgName ?? UI.SYSTEM_NO_ORG}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-1">
        {canEdit ? (
          isLanding ? (
            <IconActionButton label={UI.BTN_EDIT} onClick={() => setEditing(true)}>
              <Icon
                path="edit"
                size={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </IconActionButton>
          ) : (
            <IconRoundButton
              icon="edit"
              variant="outline"
              iconSize={16}
              onClick={() => setEditing(true)}
              aria-label={UI.BTN_EDIT}
            />
          )
        ) : null}
        {canDelete ? (
          isLanding ? (
            <IconActionButton
              label={UI.DELETE_PERSON}
              onClick={() => {
                if (!window.confirm(UI.ORG_USER_DELETE_CONFIRM)) return;
                void onDelete(user.id).catch(() => {
                  /* toast shown in useUsersAdmin */
                });
              }}
              className="text-[#ba1a1a] hover:bg-[#ffdad6]/40"
            >
              <Icon
                path="trash"
                size={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </IconActionButton>
          ) : (
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
          )
        ) : null}
      </div>
    </li>
  );
}

function IconActionButton({
  label,
  onClick,
  children,
  className = "text-[#504443] hover:bg-[#f0ede9]",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
