import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  adminOrganizationId,
  assertOrgAccess,
  isSystem,
} from '../auth/org-access.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(user: User) {
    if (isSystem(user)) {
      return this.prisma.organization.findMany({ orderBy: { name: 'asc' } });
    }
    if (user.role === UserRole.ADMIN && user.organizationId != null) {
      const org = await this.prisma.organization.findUnique({
        where: { id: user.organizationId },
      });
      return org ? [org] : [];
    }
    return this.prisma.organization.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: { name: dto.name.trim() } });
  }

  async update(id: number, user: User, dto: UpdateOrganizationDto) {
    await this.findAccessible(id, user);
    return this.prisma.organization.update({
      where: { id },
      data: { name: dto.name.trim() },
    });
  }

  async remove(id: number) {
    const personCount = await this.prisma.person.count({
      where: { organizationId: id },
    });
    if (personCount > 0) {
      throw new BadRequestException(
        'Cannot delete organization that still has members',
      );
    }
    return this.prisma.organization.delete({ where: { id } });
  }

  async findAccessible(id: number, user: User) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    assertOrgAccess(user, id);
    return org;
  }

  async resolveDefaultOrganizationId(
    user?: User | null,
    requestedOrgId?: number,
  ): Promise<number> {
    if (user?.role === UserRole.SYSTEM) {
      if (requestedOrgId != null) {
        await this.prisma.organization.findUniqueOrThrow({
          where: { id: requestedOrgId },
        });
        return requestedOrgId;
      }
      return (await this.getOrCreateDefaultOrganization()).id;
    }

    if (user?.role === UserRole.ADMIN) {
      const orgId = adminOrganizationId(user);
      if (requestedOrgId != null && requestedOrgId !== orgId) {
        throw new BadRequestException('Cannot access another organization');
      }
      return orgId;
    }

    if (requestedOrgId != null) {
      await this.prisma.organization.findUniqueOrThrow({
        where: { id: requestedOrgId },
      });
      return requestedOrgId;
    }

    return (await this.getOrCreateDefaultOrganization()).id;
  }

  private async getOrCreateDefaultOrganization() {
    const richest = await this.prisma.organization.findFirst({
      orderBy: { persons: { _count: 'desc' } },
      include: { _count: { select: { persons: true } } },
    });
    if (richest && richest._count.persons > 0) {
      return richest;
    }

    const defaultName = 'Family Tree';
    const existing = await this.prisma.organization.findFirst({
      where: { name: defaultName },
    });
    if (existing) return existing;
    return this.prisma.organization.create({ data: { name: defaultName } });
  }
}
