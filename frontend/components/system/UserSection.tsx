"use client";

import { useMemo, useState } from "react";
import type { UserRole } from "@/components/types/family-tree-types";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";
import { useUsersAdmin } from "@/hooks/useUsersAdmin";
import { useOrganizations } from "@/hooks/useOrganizations";
import type { CreateUserInput } from "@/lib/api/modules/users";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { BT } from "@/lib/constants/ui-theme";
import UserCard from "./UserCard";
import UserForm from "./UserForm";
import OrganizationCreateForm from "./OrganizationCreateForm";

type UserSectionProps = {
  mode?: "system" | "org";
  /** Chỉ hiển thị user có role này (dùng ở trang quản lý admin). */
  roleFilter?: UserRole;
  emptyMessage?: string;
  /** Hiện form tạo tổ chức phía trên (trang quản lý admin). */
  showOrgCreate?: boolean;
};

export default function UserSection({
  mode = "system",
  roleFilter,
  emptyMessage,
  showOrgCreate = false,
}: UserSectionProps) {
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

  if (users.loading || (!isOrgMode && orgs.loading)) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-4">
      {showOrgCreate ? (
        <h2 className="text-sm font-semibold text-neutral-900">
          {UI.SYSTEM_ADMINS_LIST_SECTION}
        </h2>
      ) : null}

      <div className="flex justify-end">
        <IconRoundButton
          icon="plus"
          variant="gold"
          label={UI.BTN_CREATE}
          onClick={() => setShowCreate(true)}
        />
      </div>

      {users.error ? <p className={BT.errorBg}>{users.error}</p> : null}

      {showCreate ? (
        <div className={`${BT.card} p-4`}>
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
        <p className={`text-sm ${BT.mutedOnDark}`}>
          {emptyMessage ?? UI.SYSTEM_ADMINS_EMPTY}
        </p>
      ) : null}

      <ul className="space-y-3">
        {visibleUsers.map((user) => (
          <UserCard
            key={user.id}
            mode={mode}
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
