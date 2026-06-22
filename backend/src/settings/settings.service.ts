import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Tạm thời dùng user dev khi chưa có JWT */
  async resolveUserId(userId?: number): Promise<number> {
    if (userId != null && userId > 0) return userId;

    const existing = await this.prisma.user.findFirst({
      orderBy: { id: 'asc' },
    });
    if (existing) return existing.id;

    const created = await this.prisma.user.create({
      data: { provider: 'dev', providerId: 'dev-local' },
    });
    return created.id;
  }

  async findForRequest(
    userId?: number,
  ): Promise<Record<string, unknown> | null> {
    return this.findByUserId(await this.resolveUserId(userId));
  }

  async upsertForRequest(
    userId: number | undefined,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.upsert(await this.resolveUserId(userId), data);
  }

  async findByUserId(userId: number): Promise<Record<string, unknown> | null> {
    const record = await this.prisma.userSettings.findUnique({
      where: { userId },
    });
    if (!record) return null;
    return record.data as Record<string, unknown>;
  }

  async upsert(
    userId: number,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    // Shallow-merge top-level keys so partial updates (e.g. just `book`)
    // don't wipe other settings like theme / layout.
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
