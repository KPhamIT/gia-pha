import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export type ExportPresetPayload = {
  id: string;
  label: string;
  settings: Record<string, unknown>;
};

@Injectable()
export class ExportPresetService {
  constructor(private readonly prisma: PrismaService) {}

  /** Temporary dev user fallback while JWT is optional. */
  async resolveUserId(userId?: number): Promise<number> {
    if (userId != null && userId > 0) return userId;

    const existing = await this.prisma.user.findFirst({ orderBy: { id: 'asc' } });
    if (existing) return existing.id;

    const created = await this.prisma.user.create({
      data: { provider: 'dev', providerId: 'dev-local' },
    });
    return created.id;
  }

  async findMine(userId?: number): Promise<ExportPresetPayload[]> {
    const resolvedUserId = await this.resolveUserId(userId);
    const rows = await this.prisma.exportPreset.findMany({
      where: { userId: resolvedUserId },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return rows.map((row) => ({
      id: row.key,
      label: row.label,
      settings: row.data as Record<string, unknown>,
    }));
  }

  async replaceMine(userId: number | undefined, presetsInput: unknown): Promise<ExportPresetPayload[]> {
    const resolvedUserId = await this.resolveUserId(userId);
    const presets = this.normalizePresetsInput(presetsInput);

    await this.prisma.$transaction([
      this.prisma.exportPreset.deleteMany({ where: { userId: resolvedUserId } }),
      this.prisma.exportPreset.createMany({
        data: presets.map((preset, index) => ({
          userId: resolvedUserId,
          key: preset.id,
          label: preset.label,
          sortOrder: index,
          data: preset.settings as Prisma.InputJsonValue,
        })),
      }),
    ]);

    return this.findMine(resolvedUserId);
  }

  private normalizePresetsInput(input: unknown): ExportPresetPayload[] {
    if (!Array.isArray(input)) return [];

    const byId = new Map<string, ExportPresetPayload>();
    for (const item of input) {
      if (!item || typeof item !== 'object') continue;
      const id = typeof (item as { id?: unknown }).id === 'string' ? (item as { id: string }).id.trim() : '';
      const label =
        typeof (item as { label?: unknown }).label === 'string'
          ? (item as { label: string }).label.trim()
          : '';
      const settings = (item as { settings?: unknown }).settings;
      if (!id || !label || !settings || typeof settings !== 'object' || Array.isArray(settings)) continue;
      byId.set(id, { id, label, settings: settings as Record<string, unknown> });
    }

    return [...byId.values()];
  }
}
