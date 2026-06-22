"use client";

import { useMemo, useState } from "react";
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
};

export default function UserSection({ mode = "system" }: UserSectionProps) {
  const isOrgMode = mode === "org";
  const currentUserId = useAuthStore((state) => state.user?.id);
  const users = useUsersAdmin();
  const orgs = useOrganizations();
  const [showCreate, setShowCreate] = useState(false);

  const orgMap = useMemo(
    () => new Map(orgs.items.map((org) => [org.id, org.name])),
    [orgs.items],
  );

  if (users.loading || (!isOrgMode && orgs.loading)) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-4">
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
            organizations={orgs.items}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (data) => {
              await users.create(data as CreateUserInput);
              setShowCreate(false);
            }}
          />
        </div>
      ) : null}

      <ul className="space-y-3">
        {users.items.map((user) => (
          <UserCard
            key={user.id}
            mode={mode}
            user={user}
            currentUserId={currentUserId}
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
