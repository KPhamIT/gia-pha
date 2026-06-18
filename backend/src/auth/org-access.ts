import { ForbiddenException } from '@nestjs/common';
import { UserRole, type User } from '../../generated/prisma/client.js';

export function canMutate(user: User | null | undefined): boolean {
  return user?.role === UserRole.SYSTEM || user?.role === UserRole.ADMIN;
}

export function isSystem(user: User | null | undefined): boolean {
  return user?.role === UserRole.SYSTEM;
}

export function assertOrgAccess(user: User, organizationId: number): void {
  if (user.role === UserRole.SYSTEM) return;
  if (user.role === UserRole.ADMIN && user.organizationId === organizationId) return;
  throw new ForbiddenException('No access to this organization');
}

export function adminOrganizationId(user: User): number {
  if (user.role !== UserRole.ADMIN || user.organizationId == null) {
    throw new ForbiddenException('Admin organization is not configured');
  }
  return user.organizationId;
}
