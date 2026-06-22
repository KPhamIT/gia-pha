"use client";

import { useState } from "react";
import type {
  AuthUser,
  Organization,
  UserRole,
} from "@/components/types/family-tree-types";
import type { CreateUserInput, UpdateUserInput } from "@/lib/api/modules/users";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { systemRoleLabel } from "@/hooks/useSystemAccess";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { inputClassName } from "@/components/ui/CollapsibleSection";
import {
  SYSTEM_ROLES,
  buildUserPayload,
  validateUserForm,
} from "./user-form-utils";

type Props = {
  mode: "system" | "org";
  initial?: AuthUser;
  organizations: Organization[];
  onCancel: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
};

export default function UserForm({
  mode,
  initial,
  organizations,
  onCancel,
  onSubmit,
}: Props) {
  const isOrgMode = mode === "org";
  const [username, setUsername] = useState(initial?.username ?? "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<UserRole>(initial?.role ?? "STANDARD");
  const [organizationId, setOrganizationId] = useState<string>(
    initial?.organizationId != null ? String(initial.organizationId) : "",
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const effectiveRole = isOrgMode && !initial ? "STANDARD" : role;
  const needsOrg = !isOrgMode && effectiveRole === "ADMIN";
  const showRoleField = !isOrgMode;

  const handleSubmit = async () => {
    const fields = {
      initial,
      isOrgMode,
      username,
      password,
      email,
      role,
      organizationId,
    };
    const error = validateUserForm(fields);
    setFormError(error);
    if (error) return;

    setSaving(true);
    try {
      await onSubmit(buildUserPayload(fields));
    } catch {
      /* toast shown in useUsersAdmin */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {formError ? (
        <p className={`${BT.errorBgLight} md:col-span-2`}>{formError}</p>
      ) : null}
      {!initial ? (
        <>
          <label className="block text-sm">
            <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>
              {UI.SYSTEM_USER_USERNAME}
            </span>
            <input
              className={inputClassName}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>
              {UI.SYSTEM_USER_PASSWORD}
            </span>
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
          <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>
            {UI.SYSTEM_USER_NEW_PASSWORD}
          </span>
          <input
            type="password"
            className={inputClassName}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}
      <label className="block text-sm">
        <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>
          {UI.SYSTEM_USER_EMAIL}
        </span>
        <input
          className={inputClassName}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {showRoleField ? (
        <label className="block text-sm">
          <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>
            {UI.SYSTEM_USER_ROLE}
          </span>
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
          <span className={`mb-1 block font-medium ${BT.mutedOnLight}`}>
            {UI.SYSTEM_USER_ORG}
          </span>
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
        <IconRoundButton
          icon="close"
          variant="outline"
          label={UI.CANCEL}
          onClick={onCancel}
        />
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
