import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  adminOrganizationId,
  assertOrgAccess,
  isSystem,
} from '../auth/org-access.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import {
  createOrgAccessToken,
  verifyOrgAccessToken,
} from './org-access-token.js';

export type OrganizationPublicAccess = {
  accessToken: string;
  publicAccessUrl: string;
};

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async listForUser(user: User) {
    if (isSystem(user)) {
      const orgs = await this.prisma.organization.findMany({
        orderBy: { name: 'asc' },
      });
      return orgs.map((org) => this.withPublicAccess(org));
    }
    if (user.role === UserRole.ADMIN && user.organizationId != null) {
      const org = await this.prisma.organization.findUnique({
        where: { id: user.organizationId },
      });
      return org ? [this.withPublicAccess(org)] : [];
    }
    return this.prisma.organization.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateOrganizationDto) {
    const org = await this.prisma.organization.create({
      data: { name: dto.name.trim() },
    });
    return this.withPublicAccess(org);
  }

  async update(id: number, user: User, dto: UpdateOrganizationDto) {
    await this.findAccessible(id, user);
    const org = await this.prisma.organization.update({
      where: { id },
      data: { name: dto.name.trim() },
    });
    return this.withPublicAccess(org);
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

  async resolvePublicByToken(token: string) {
    const orgId = this.decodeAccessToken(token);
    if (orgId == null) {
      throw new NotFoundException('Invalid organization link');
    }
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return {
      id: org.id,
      name: org.name,
      accessToken: token,
      publicAccessUrl: this.buildPublicAccessUrl(org.id),
    };
  }

  async getAccessLinkForUser(user: User, organizationId?: number) {
    let orgId: number;
    if (isSystem(user)) {
      if (organizationId == null) {
        throw new BadRequestException('organizationId is required');
      }
      orgId = organizationId;
    } else if (user.role === UserRole.ADMIN) {
      orgId = adminOrganizationId(user);
      if (organizationId != null && organizationId !== orgId) {
        throw new ForbiddenException('Cannot access another organization');
      }
    } else {
      throw new ForbiddenException('Admin or system role required');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return {
      id: org.id,
      name: org.name,
      ...this.buildAccessFields(org.id),
    };
  }

  async resolveDefaultOrganizationId(
    user?: User | null,
    requestedOrgId?: number,
    orgAccessToken?: string,
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

    if (user?.organizationId != null) {
      return user.organizationId;
    }

    if (orgAccessToken) {
      const orgId = this.decodeAccessToken(orgAccessToken);
      if (orgId == null) {
        throw new BadRequestException('Invalid organization link');
      }
      await this.prisma.organization.findUniqueOrThrow({
        where: { id: orgId },
      });
      return orgId;
    }

    throw new ForbiddenException('Organization access link required');
  }

  withPublicAccess<T extends { id: number; name: string }>(org: T) {
    return { ...org, ...this.buildAccessFields(org.id) };
  }

  private buildAccessFields(orgId: number): OrganizationPublicAccess {
    const accessToken = createOrgAccessToken(orgId, this.accessSecret());
    return {
      accessToken,
      publicAccessUrl: this.buildPublicAccessUrl(orgId),
    };
  }

  private buildPublicAccessUrl(orgId: number): string {
    const base =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const token = createOrgAccessToken(orgId, this.accessSecret());
    return `${base}/join/${encodeURIComponent(token)}`;
  }

  private decodeAccessToken(token: string): number | null {
    return verifyOrgAccessToken(token, this.accessSecret());
  }

  private accessSecret(): string {
    return this.config.get<string>('JWT_SECRET', 'change-me');
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
