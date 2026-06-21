import type { AuthUser, UserRole } from '@/components/types/family-tree-types';
import type { CreateUserInput, UpdateUserInput } from '@/lib/api/modules/users';
import { UI } from '@/lib/constants/ui-strings';

export const SYSTEM_ROLES: UserRole[] = ['SYSTEM', 'ADMIN', 'STANDARD'];

export type UserFormFields = {
  initial?: AuthUser;
  isOrgMode: boolean;
  username: string;
  password: string;
  email: string;
  role: UserRole;
  organizationId: string;
};

/** Returns a localized error message, or null when the form is valid. */
export function validateUserForm(f: UserFormFields): string | null {
  if (!f.initial) {
    if (!f.username.trim()) return UI.SYSTEM_USER_USERNAME_REQUIRED;
    if (f.password.length < 6) return UI.SYSTEM_USER_PASSWORD_MIN;
  } else if (f.password && f.password.length < 6) {
    return UI.SYSTEM_USER_PASSWORD_MIN;
  }
  if (!f.initial && !f.isOrgMode && f.role === 'ADMIN' && !f.organizationId) {
    return UI.SYSTEM_USER_ORG_REQUIRED;
  }
  return null;
}

/** Builds the create/update payload from the current form fields. */
export function buildUserPayload(f: UserFormFields): CreateUserInput | UpdateUserInput {
  if (f.initial) {
    const payload: UpdateUserInput = {
      email: f.email.trim() || null,
      ...(f.password ? { password: f.password } : {}),
    };
    if (!f.isOrgMode) {
      payload.role = f.role;
      payload.organizationId =
        f.role === 'ADMIN' || (f.role === 'STANDARD' && f.organizationId) ? Number(f.organizationId) : null;
    }
    return payload;
  }
  return {
    username: f.username.trim(),
    password: f.password,
    email: f.email.trim() || undefined,
    role: f.isOrgMode ? 'STANDARD' : f.role,
    organizationId: !f.isOrgMode && f.organizationId ? Number(f.organizationId) : undefined,
  };
}
