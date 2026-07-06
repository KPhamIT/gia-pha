"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/icons/Icon";
import type { UserRole } from "@/components/types/family-tree-types";
import { AC } from "@/components/auth/account-theme";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";
import { useUsersAdmin } from "@/hooks/useUsersAdmin";
import { useOrganizations } from "@/hooks/useOrganizations";
import type { CreateUserInput } from "@/lib/api/modules/users";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { BT } from "@/lib/constants/ui-theme";
import UserCard from "./UserCard";
import UserForm from "./UserForm";

type UserSectionProps = {
  mode?: "system" | "org";
  variant?: "book" | "landing";
  roleFilter?: UserRole;
  emptyMessage?: string;
  showOrgCreate?: boolean;
};

export default function UserSection({
  mode = "system",
  variant = "book",
  roleFilter,
  emptyMessage,
  showOrgCreate = false,
}: UserSectionProps) {
  const isLanding = variant === "landing";
  const isOrgMode = mode === "org";
  const currentUserId = useAuthStore((state) => state.user?.id);
  const users = useUsersAdmin();
  const orgs = useOrganizations();
  const [showCreate, setShowCreate] = useState(false);

  const orgMap = useMemo(
    () => new Map(orgs.items.map((org) => [org.id, org.name])),
    [orgs.items],
  );

  const visibleUsers = useMemo(
    () =>
      roleFilter
        ? users.items.filter((user) => user.role === roleFilter)
        : users.items,
    [roleFilter, users.items],
  );

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const cardClass = isLanding ? AC.card : BT.card;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.errorBg;

  if (users.loading || (!isOrgMode && orgs.loading)) {
    return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-4">
      {showOrgCreate ? (
        <h2
          className={
            isLanding
              ? AC.sectionTitle
              : "text-sm font-semibold text-neutral-900"
          }
        >
          {UI.SYSTEM_ADMINS_LIST_SECTION}
        </h2>
      ) : null}

      <div className="flex justify-end">
        {isLanding ? (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
          >
            <Icon
              path="plus"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
            {UI.BTN_CREATE}
          </button>
        ) : (
          <IconRoundButton
            icon="plus"
            variant="gold"
            label={UI.BTN_CREATE}
            onClick={() => setShowCreate(true)}
          />
        )}
      </div>

      {users.error ? <p className={errorClass}>{users.error}</p> : null}

      {showCreate ? (
        <div className={`${cardClass} p-4 md:p-5`}>
          <UserForm
            mode={mode}
            fixedRole={roleFilter}
            organizations={orgs.items}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (data) => {
              await users.create(data as CreateUserInput);
              setShowCreate(false);
            }}
          />
        </div>
      ) : null}

      {roleFilter && visibleUsers.length === 0 ? (
        <p className={`text-sm ${loadingClass}`}>
          {emptyMessage ?? UI.SYSTEM_ADMINS_EMPTY}
        </p>
      ) : null}

      <ul className="space-y-3">
        {visibleUsers.map((user) => (
          <UserCard
            key={user.id}
            mode={mode}
            variant={variant}
            user={user}
            currentUserId={currentUserId}
            deletableRoles={roleFilter ? [roleFilter] : undefined}
            orgName={
              user.organizationId ? orgMap.get(user.organizationId) : null
            }
            organizations={orgs.items}
            onUpdate={users.update}
            onDelete={users.remove}
          />
        ))}
      </ul>
    </div>
  );
}
