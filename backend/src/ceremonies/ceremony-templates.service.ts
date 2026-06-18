import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import {
  adminOrganizationId,
  assertOrgMemberAccess,
  isSystem,
} from '../auth/org-access.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateCeremonyTemplateDto,
  UpdateCeremonyTemplateDto,
} from './dto/ceremony-template.dto.js';

@Injectable()
export class CeremonyTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: User) {
    const organizationId = this.resolveOrganizationId(user);
    return this.prisma.ceremonyTemplate.findMany({
      where: { organizationId },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(user: User, id: number) {
    const template = await this.getTemplateOrThrow(id);
    assertOrgMemberAccess(user, template.organizationId);
    return template;
  }

  async create(user: User, dto: CreateCeremonyTemplateDto) {
    const organizationId = this.resolveOrganizationId(user);
    const count = await this.prisma.ceremonyTemplate.count({ where: { organizationId } });
    const isDefault = dto.isDefault ?? count === 0;

    return this.prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.ceremonyTemplate.updateMany({
          where: { organizationId },
          data: { isDefault: false },
        });
      }

      return tx.ceremonyTemplate.create({
        data: {
          organizationId,
          name: dto.name.trim(),
          content: dto.content,
          isDefault,
        },
      });
    });
  }

  async update(user: User, id: number, dto: UpdateCeremonyTemplateDto) {
    const existing = await this.getTemplateOrThrow(id);
    this.assertManageAccess(user, existing.organizationId);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.ceremonyTemplate.updateMany({
          where: { organizationId: existing.organizationId },
          data: { isDefault: false },
        });
      }

      return tx.ceremonyTemplate.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          content: dto.content,
          isDefault: dto.isDefault,
        },
      });
    });
  }

  async setDefault(user: User, id: number) {
    const existing = await this.getTemplateOrThrow(id);
    this.assertManageAccess(user, existing.organizationId);

    return this.prisma.$transaction(async (tx) => {
      await tx.ceremonyTemplate.updateMany({
        where: { organizationId: existing.organizationId },
        data: { isDefault: false },
      });
      return tx.ceremonyTemplate.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  }

  async remove(user: User, id: number) {
    const existing = await this.getTemplateOrThrow(id);
    this.assertManageAccess(user, existing.organizationId);

    const remaining = await this.prisma.ceremonyTemplate.count({
      where: { organizationId: existing.organizationId, id: { not: id } },
    });
    if (remaining === 0) {
      throw new BadRequestException('Cannot delete the only ceremony template');
    }

    await this.prisma.ceremonyTemplate.delete({ where: { id } });

    if (existing.isDefault) {
      const next = await this.prisma.ceremonyTemplate.findFirst({
        where: { organizationId: existing.organizationId },
        orderBy: { id: 'asc' },
      });
      if (next) {
        await this.prisma.ceremonyTemplate.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return { id };
  }

  async resolveTemplateContent(organizationId: number): Promise<string | null> {
    const template = await this.prisma.ceremonyTemplate.findFirst({
      where: { organizationId, isDefault: true },
    });
    if (template) return template.content;

    const fallback = await this.prisma.ceremonyTemplate.findFirst({
      where: { organizationId },
      orderBy: { id: 'asc' },
    });
    return fallback?.content ?? null;
  }

  private resolveOrganizationId(user: User): number {
    if (isSystem(user)) {
      throw new BadRequestException('System user must use org context via admin account');
    }
    if (user.organizationId == null) {
      throw new ForbiddenException('User is not assigned to an organization');
    }
    return user.organizationId;
  }

  private assertManageAccess(user: User, organizationId: number): void {
    if (isSystem(user)) return;
    if (user.organizationId !== adminOrganizationId(user)) {
      throw new ForbiddenException('No access to this organization');
    }
    if (organizationId !== user.organizationId) {
      throw new ForbiddenException('No access to this template');
    }
  }

  private async getTemplateOrThrow(id: number) {
    const template = await this.prisma.ceremonyTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('Ceremony template not found');
    }
    return template;
  }
}
