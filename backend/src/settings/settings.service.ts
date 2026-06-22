import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService,
  ) {}

  async findByUserId(userId: number): Promise<Record<string, unknown> | null> {
    const record = await this.prisma.userSettings.findUnique({
      where: { userId },
    });
    if (!record) return null;
    return record.data as Record<string, unknown>;
  }

  async findForGuest(
    orgAccessToken?: string,
  ): Promise<Record<string, unknown> | null> {
    const organizationId =
      await this.organizationService.resolveDefaultOrganizationId(
        null,
        undefined,
        orgAccessToken,
      );

    const user = await this.prisma.user.findFirst({
      where: { organizationId },
      orderBy: { id: 'asc' },
      include: { settings: true },
    });

    if (!user?.settings) return null;
    return user.settings.data as Record<string, unknown>;
  }

  async upsert(
    userId: number,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const existing = await this.prisma.userSettings.findUnique({
      where: { userId },
    });
    const current =
      (existing?.data as Record<string, unknown> | undefined) ?? {};
    const merged = { ...current, ...data };
    const jsonData = merged as Prisma.InputJsonValue;
    const record = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, data: jsonData },
      update: { data: jsonData },
    });
    return record.data as Record<string, unknown>;
  }
}
