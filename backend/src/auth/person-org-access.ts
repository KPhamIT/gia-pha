import { ForbiddenException } from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { assertOrgMemberAccess } from './org-access.js';

/** STANDARD (cùng org + feature) hoặc ADMIN/SYSTEM được sửa person. */
export function assertPersonOrgAccess(
  user: User,
  person: { organizationId: number },
): void {
  assertOrgMemberAccess(user, person.organizationId);
}

export function assertSameOrganization(
  left: { organizationId: number },
  right: { organizationId: number },
): void {
  if (left.organizationId !== right.organizationId) {
    throw new ForbiddenException(
      'Persons must belong to the same organization',
    );
  }
}
