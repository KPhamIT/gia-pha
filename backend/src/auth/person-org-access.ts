import { ForbiddenException } from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { assertOrgAccess } from './org-access.js';

export function assertPersonOrgAccess(
  user: User,
  person: { organizationId: number },
): void {
  assertOrgAccess(user, person.organizationId);
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
