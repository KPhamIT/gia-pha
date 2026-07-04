import { ForbiddenException } from '@nestjs/common';
import type { CeremonyTemplate, User } from '../../generated/prisma/client.js';
import { isSystem } from '../auth/org-access.js';

export type CeremonyTemplateWithAccess = CeremonyTemplate & {
  canEdit: boolean;
  canDelete: boolean;
  canSetDefault: boolean;
};

export function assertCanViewCeremonyTemplate(
  user: User,
  template: CeremonyTemplate,
): void {
  if (template.isSystemTemplate) return;
  if (isSystem(user)) return;
  if (user.organizationId !== template.organizationId) {
    throw new ForbiddenException('No access to this template');
  }
}

export function assertCanCreateCeremonyTemplate(user: User): void {
  if (user.isDemo) {
    throw new ForbiddenException('Demo account cannot create templates');
  }
  if (isSystem(user)) return;
  if (user.organizationId == null) {
    throw new ForbiddenException('User is not assigned to an organization');
  }
}

export function assertCanMutateCeremonyTemplate(
  user: User,
  template: CeremonyTemplate,
): void {
  if (user.isDemo) {
    throw new ForbiddenException('Demo account cannot modify templates');
  }
  assertCanViewCeremonyTemplate(user, template);
  if (template.createdByUserId !== user.id) {
    throw new ForbiddenException('Only the creator can modify this template');
  }
}

export function assertCanSetDefaultCeremonyTemplate(
  user: User,
  template: CeremonyTemplate,
): void {
  if (user.isDemo) {
    throw new ForbiddenException('Demo account cannot modify templates');
  }
  if (user.organizationId !== template.organizationId) {
    throw new ForbiddenException(
      'Can only set default for templates in your organization',
    );
  }
  if (isSystem(user)) return;
  if (user.organizationId == null) {
    throw new ForbiddenException('User is not assigned to an organization');
  }
}

export function canCreateCeremonyTemplate(user: User): boolean {
  if (user.isDemo) return false;
  if (isSystem(user)) return true;
  return user.organizationId != null;
}

export function canMutateCeremonyTemplate(
  user: User,
  template: CeremonyTemplate,
): boolean {
  if (user.isDemo) return false;
  return template.createdByUserId === user.id;
}

export function canSetDefaultCeremonyTemplate(
  user: User,
  template: CeremonyTemplate,
): boolean {
  if (user.isDemo) return false;
  return user.organizationId === template.organizationId;
}

export function withCeremonyTemplateAccess(
  user: User,
  template: CeremonyTemplate,
): CeremonyTemplateWithAccess {
  const canEdit = canMutateCeremonyTemplate(user, template);
  return {
    ...template,
    canEdit,
    canDelete: canEdit,
    canSetDefault: canSetDefaultCeremonyTemplate(user, template),
  };
}

export function listCeremonyTemplatesWhere(user: User) {
  if (isSystem(user)) {
    return {};
  }
  if (user.organizationId == null) {
    return { isSystemTemplate: true };
  }
  return {
    OR: [
      { organizationId: user.organizationId, isSystemTemplate: false },
      { isSystemTemplate: true },
    ],
  };
}
