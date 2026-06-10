import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

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
    const jsonData = data as Prisma.InputJsonValue;
    const record = await this.prisma.userSettings.upsert({
      where: { userId },
      create: { userId, data: jsonData },
      update: { data: jsonData },
    });
    return record.data as Record<string, unknown>;
  }
}
