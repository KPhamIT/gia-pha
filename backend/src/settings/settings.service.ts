import { Injectable } from '@nestjs/common';
import { Prisma, UserRole, type User } from '../../generated/prisma/client.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const EMPTY_SETTINGS: Record<string, unknown> = {};

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService,
  ) {}

  async findForUser(
    user: Pick<User, 'id' | 'organizationId' | 'role'>,
  ): Promise<Record<string, unknown>> {
    const own = await this.findByUserId(user.id);
    if (this.hasStoredSettings(own)) return own;

    if (user.organizationId != null) {
      const admin = await this.findOrgAdminSettings(
        user.organizationId,
        user.id,
      );
      if (admin !== null) return admin;
    }

    return EMPTY_SETTINGS;
  }

  async findByUserId(userId: number): Promise<Record<string, unknown> | null> {
    const record = await this.prisma.userSettings.findUnique({
      where: { userId },
    });
    if (!record) return null;
    return record.data as Record<string, unknown>;
  }

  private async findOrgAdminSettings(
    organizationId: number,
    excludeUserId?: number,
  ): Promise<Record<string, unknown> | null> {
    const where: Prisma.UserWhereInput = {
      organizationId,
      role: UserRole.ADMIN,
      settings: { isNot: null },
    };
    if (excludeUserId != null) {
      where.id = { not: excludeUserId };
    }

    const admin = await this.prisma.user.findFirst({
      where,
      include: { settings: true },
      orderBy: { id: 'asc' },
    });

    if (!admin?.settings) return null;
    const data = admin.settings.data as Record<string, unknown>;
    if (!this.hasStoredSettings(data)) return null;
    return data;
  }

  async findForGuest(
    orgAccessToken?: string,
  ): Promise<Record<string, unknown>> {
    const organizationId =
      await this.organizationService.resolveDefaultOrganizationId(
        null,
        undefined,
        orgAccessToken,
      );

    const admin = await this.findOrgAdminSettings(organizationId);
    if (admin !== null) return admin;

    return EMPTY_SETTINGS;
  }

  private hasStoredSettings(
    data: Record<string, unknown> | null,
  ): data is Record<string, unknown> {
    return data !== null && Object.keys(data).length > 0;
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
