'use client';

import { useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import type { AuthUser, Organization, UserRole } from '@/components/types/family-tree-types';
import { UI } from '@/lib/constants/ui-strings';
import { systemRoleLabel } from '@/hooks/useSystemAccess';
import { useUsersAdmin } from '@/hooks/useUsersAdmin';
import { useOrganizations } from '@/hooks/useOrganizations';
import type { CreateUserInput, UpdateUserInput } from '@/lib/api/modules/users';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { BT } from '@/lib/constants/ui-theme';
import { inputClassName } from '@/components/ui/CollapsibleSection';

const SYSTEM_ROLES: UserRole[] = ['SYSTEM', 'ADMIN', 'STANDARD'];

type UserSectionProps = {
  mode?: 'system' | 'org';
};

export default function UserSection({ mode = 'system' }: UserSectionProps) {
  const isOrgMode = mode === 'org';
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

      <div className={`overflow-x-auto ${BT.panel}`}>
        <table className="min-w-full text-left text-sm">
          <thead className={BT.bandHeader}>
            <tr>
              <th className="px-4 py-3 font-medium">{UI.SYSTEM_USER_USERNAME}</th>
              <th className="px-4 py-3 font-medium">{UI.SYSTEM_USER_ROLE}</th>
              {!isOrgMode ? (
                <th className="px-4 py-3 font-medium">{UI.SYSTEM_USER_ORG}</th>
              ) : null}
              <th className="px-4 py-3 font-medium">{UI.SYSTEM_USER_EMAIL}</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {users.items.map((user) => (
              <UserRow
                key={user.id}
                mode={mode}
                user={user}
                currentUserId={currentUserId}
                orgName={user.organizationId ? orgMap.get(user.organizationId) : null}
                organizations={orgs.items}
                onUpdate={users.update}
                onDelete={users.remove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({
  mode,
  user,
  currentUserId,
  orgName,
  organizations,
  onUpdate,
  onDelete,
}: {
  mode: 'system' | 'org';
  user: AuthUser;
  currentUserId?: number;
  orgName?: string | null;
  organizations: Organization[];
  onUpdate: ReturnType<typeof useUsersAdmin>['update'];
  onDelete: ReturnType<typeof useUsersAdmin>['remove'];
}) {
  const [editing, setEditing] = useState(false);
  const isOrgMode = mode === 'org';
  const canEdit = !isOrgMode || user.role === 'STANDARD' || user.id === currentUserId;
  const canDelete = isOrgMode && user.role === 'STANDARD' && user.id !== currentUserId;

  if (!editing) {
    return (
      <tr className="active:bg-amber-50/50">
        <td className="px-4 py-3 font-medium">{user.username ?? '—'}</td>
        <td className="px-4 py-3">{systemRoleLabel(user.role)}</td>
        {!isOrgMode ? (
          <td className="px-4 py-3">{orgName ?? UI.SYSTEM_NO_ORG}</td>
        ) : null}
        <td className="px-4 py-3">{user.email ?? '—'}</td>
        <td className="px-4 py-3">
          <div className="flex justify-end gap-1">
            {canEdit ? (
              <IconRoundButton
                icon="edit"
                variant="outline"
                iconSize={16}
                label={UI.BTN_EDIT}
                onClick={() => setEditing(true)}
              />
            ) : null}
            {canDelete ? (
              <IconRoundButton
                icon="trash"
                variant="danger"
                iconSize={16}
                label={UI.DELETE_PERSON}
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
        </td>
      </tr>
    );
  }

  const colSpan = isOrgMode ? 4 : 5;

  return (
    <tr>
      <td colSpan={colSpan} className="bg-amber-50/40 p-4">
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
      </td>
    </tr>
  );
}

type UserFormProps = {
  mode: 'system' | 'org';
  initial?: AuthUser;
  organizations: Organization[];
  onCancel: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
};

function UserForm({ mode, initial, organizations, onCancel, onSubmit }: UserFormProps) {
  const isOrgMode = mode === 'org';
  const [username, setUsername] = useState(initial?.username ?? '');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<UserRole>(initial?.role ?? 'STANDARD');
  const [organizationId, setOrganizationId] = useState<string>(
    initial?.organizationId != null ? String(initial.organizationId) : '',
  );
  const [saving, setSaving] = useState(false);

  const effectiveRole = isOrgMode && !initial ? 'STANDARD' : role;
  const needsOrg = !isOrgMode && effectiveRole === 'ADMIN';
  const showRoleField = !isOrgMode;
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    if (!initial) {
      if (!username.trim()) {
        setFormError(UI.SYSTEM_USER_USERNAME_REQUIRED);
        return;
      }
      if (password.length < 6) {
        setFormError(UI.SYSTEM_USER_PASSWORD_MIN);
        return;
      }
    } else if (password && password.length < 6) {
      setFormError(UI.SYSTEM_USER_PASSWORD_MIN);
      return;
    }

    if (!initial && !isOrgMode && role === 'ADMIN' && !organizationId) {
      setFormError(UI.SYSTEM_USER_ORG_REQUIRED);
      return;
    }

    setSaving(true);
    try {
      if (initial) {
        const payload: UpdateUserInput = {
          email: email.trim() || null,
          ...(password ? { password } : {}),
        };
        if (!isOrgMode) {
          payload.role = role;
          payload.organizationId =
            role === 'ADMIN' || (role === 'STANDARD' && organizationId)
              ? Number(organizationId)
              : null;
        }
        await onSubmit(payload);
      } else {
        const payload: CreateUserInput = {
          username: username.trim(),
          password,
          email: email.trim() || undefined,
          role: isOrgMode ? 'STANDARD' : role,
          organizationId:
            !isOrgMode && organizationId ? Number(organizationId) : undefined,
        };
        await onSubmit(payload);
      }
    } catch {
      /* toast shown in useUsersAdmin */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {formError ? <p className={`${BT.errorBgLight} md:col-span-2`}>{formError}</p> : null}
      {!initial ? (
        <>
          <label className="block text-sm">
            <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>{UI.SYSTEM_USER_USERNAME}</span>
            <input className={inputClassName} value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>{UI.SYSTEM_USER_PASSWORD}</span>
            <input
              type="password"
              className={inputClassName}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </>
      ) : (
        <label className="block text-sm md:col-span-2">
          <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>{UI.SYSTEM_USER_NEW_PASSWORD}</span>
          <input
            type="password"
            className={inputClassName}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}
      <label className="block text-sm">
        <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>{UI.SYSTEM_USER_EMAIL}</span>
        <input className={inputClassName} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {showRoleField ? (
        <label className="block text-sm">
          <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>{UI.SYSTEM_USER_ROLE}</span>
          <select
            className={inputClassName}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {SYSTEM_ROLES.map((item) => (
              <option key={item} value={item}>
                {systemRoleLabel(item)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {needsOrg ? (
        <label className="block text-sm md:col-span-2">
          <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>{UI.SYSTEM_USER_ORG}</span>
          <select
            className={inputClassName}
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
          >
            <option value="">{UI.SYSTEM_NO_ORG}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="flex justify-end gap-2 md:col-span-2">
        <IconRoundButton icon="close" variant="outline" label={UI.CANCEL} onClick={onCancel} />
        <IconRoundButton
          icon="save"
          variant="gold"
          loading={saving}
          label={initial ? UI.SAVE : UI.BTN_CREATE}
          onClick={() => void handleSubmit()}
        />
      </div>
    </div>
  );
}
