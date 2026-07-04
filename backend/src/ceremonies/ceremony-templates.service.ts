import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { isSystem } from '../auth/org-access.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  assertCanCreateCeremonyTemplate,
  assertCanMutateCeremonyTemplate,
  assertCanSetDefaultCeremonyTemplate,
  assertCanViewCeremonyTemplate,
  listCeremonyTemplatesWhere,
  withCeremonyTemplateAccess,
} from './ceremony-template-access.js';
import {
  CreateCeremonyTemplateDto,
  UpdateCeremonyTemplateDto,
} from './dto/ceremony-template.dto.js';

@Injectable()
export class CeremonyTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: User) {
    if (!isSystem(user) && user.organizationId == null) {
      const items = await this.prisma.ceremonyTemplate.findMany({
        where: { isSystemTemplate: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      });
      return items.map((item) => withCeremonyTemplateAccess(user, item));
    }

    const items = await this.prisma.ceremonyTemplate.findMany({
      where: listCeremonyTemplatesWhere(user),
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
    return items.map((item) => withCeremonyTemplateAccess(user, item));
  }

  async findOne(user: User, id: number) {
    const template = await this.getTemplateOrThrow(id);
    assertCanViewCeremonyTemplate(user, template);
    return withCeremonyTemplateAccess(user, template);
  }

  async create(user: User, dto: CreateCeremonyTemplateDto) {
    assertCanCreateCeremonyTemplate(user);
    const organizationId = await this.resolveOrganizationIdForCreate(user);
    const isSystemTemplate = isSystem(user);

    const count = await this.prisma.ceremonyTemplate.count({
      where: {
        organizationId,
        isSystemTemplate: false,
      },
    });
    const isDefault = dto.isDefault ?? count === 0;

    return this.prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.ceremonyTemplate.updateMany({
          where: { organizationId, isSystemTemplate: false },
          data: { isDefault: false },
        });
      }

      const created = await tx.ceremonyTemplate.create({
        data: {
          organizationId,
          name: dto.name.trim(),
          content: dto.content,
          isDefault: isSystemTemplate ? false : isDefault,
          isSystemTemplate,
          createdByUserId: user.id,
          intro: dto.intro,
          meaning: dto.meaning,
          preparation: dto.preparation,
          sourceBookTitle: dto.sourceBookTitle,
          seoSlug: dto.seoSlug,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          seoExcerpt: dto.seoExcerpt,
          seoKeywords: dto.seoKeywords,
        },
      });

      return withCeremonyTemplateAccess(user, created);
    });
  }

  async update(user: User, id: number, dto: UpdateCeremonyTemplateDto) {
    const existing = await this.getTemplateOrThrow(id);
    assertCanMutateCeremonyTemplate(user, existing);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.ceremonyTemplate.updateMany({
          where: {
            organizationId: existing.organizationId,
            isSystemTemplate: false,
          },
          data: { isDefault: false },
        });
      }

      const updated = await tx.ceremonyTemplate.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          content: dto.content,
          isDefault: dto.isDefault,
          intro: dto.intro,
          meaning: dto.meaning,
          preparation: dto.preparation,
          sourceBookTitle: dto.sourceBookTitle,
          seoSlug: dto.seoSlug,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          seoExcerpt: dto.seoExcerpt,
          seoKeywords: dto.seoKeywords,
        },
      });

      return withCeremonyTemplateAccess(user, updated);
    });
  }

  async setDefault(user: User, id: number) {
    const existing = await this.getTemplateOrThrow(id);
    assertCanSetDefaultCeremonyTemplate(user, existing);
    if (existing.isSystemTemplate) {
      throw new ForbiddenException(
        'Cannot set a system template as organization default',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.ceremonyTemplate.updateMany({
        where: {
          organizationId: existing.organizationId,
          isSystemTemplate: false,
        },
        data: { isDefault: false },
      });
      const updated = await tx.ceremonyTemplate.update({
        where: { id },
        data: { isDefault: true },
      });
      return withCeremonyTemplateAccess(user, updated);
    });
  }

  async remove(user: User, id: number) {
    const existing = await this.getTemplateOrThrow(id);
    assertCanMutateCeremonyTemplate(user, existing);

    if (!existing.isSystemTemplate) {
      const remaining = await this.prisma.ceremonyTemplate.count({
        where: {
          organizationId: existing.organizationId,
          isSystemTemplate: false,
          id: { not: id },
        },
      });
      if (remaining === 0) {
        throw new BadRequestException('Cannot delete the only ceremony template');
      }
    }

    await this.prisma.ceremonyTemplate.delete({ where: { id } });

    if (existing.isDefault && !existing.isSystemTemplate) {
      const next = await this.prisma.ceremonyTemplate.findFirst({
        where: {
          organizationId: existing.organizationId,
          isSystemTemplate: false,
        },
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
      where: { organizationId, isDefault: true, isSystemTemplate: false },
    });
    if (template) return template.content;

    const fallback = await this.prisma.ceremonyTemplate.findFirst({
      where: { organizationId, isSystemTemplate: false },
      orderBy: { id: 'asc' },
    });
    if (fallback) return fallback.content;

    const systemDefault = await this.prisma.ceremonyTemplate.findFirst({
      where: { isSystemTemplate: true, isDefault: true },
    });
    if (systemDefault) return systemDefault.content;

    const systemFallback = await this.prisma.ceremonyTemplate.findFirst({
      where: { isSystemTemplate: true },
      orderBy: { id: 'asc' },
    });
    return systemFallback?.content ?? null;
  }

  assertTemplateUsableForOrganization(
    template: { organizationId: number; isSystemTemplate: boolean },
    organizationId: number,
  ): void {
    if (template.isSystemTemplate) return;
    if (template.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Template does not belong to the person organization',
      );
    }
  }

  private async resolveOrganizationIdForCreate(user: User): Promise<number> {
    if (isSystem(user)) {
      if (user.organizationId != null) return user.organizationId;
      const org = await this.prisma.organization.findFirst({
        orderBy: { id: 'asc' },
        select: { id: true },
      });
      if (!org) {
        throw new BadRequestException('No organization available for templates');
      }
      return org.id;
    }
    if (user.organizationId == null) {
      throw new ForbiddenException('User is not assigned to an organization');
    }
    return user.organizationId;
  }

  private async getTemplateOrThrow(id: number) {
    const template = await this.prisma.ceremonyTemplate.findUnique({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException('Ceremony template not found');
    }
    return template;
  }
}
