import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ExportSystemAssetAccess,
  ExportSystemAssetCategory,
  Prisma,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { UploadImageResult } from './media.types.js';

export type SystemAssetRecord = {
  id: number;
  name: string;
  category: 'background' | 'scroll' | 'couplet' | 'other';
  access: 'free' | 'paid';
  provider: 'local' | 'cloudinary';
  key: string;
  url: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  sortOrder: number;
  createdAt: string;
};

const CATEGORY_TO_API: Record<
  ExportSystemAssetCategory,
  SystemAssetRecord['category']
> = {
  [ExportSystemAssetCategory.BACKGROUND]: 'background',
  [ExportSystemAssetCategory.SCROLL]: 'scroll',
  [ExportSystemAssetCategory.COUPLET]: 'couplet',
  [ExportSystemAssetCategory.OTHER]: 'other',
};

const API_TO_CATEGORY: Record<
  SystemAssetRecord['category'],
  ExportSystemAssetCategory
> = {
  background: ExportSystemAssetCategory.BACKGROUND,
  scroll: ExportSystemAssetCategory.SCROLL,
  couplet: ExportSystemAssetCategory.COUPLET,
  other: ExportSystemAssetCategory.OTHER,
};

@Injectable()
export class SystemAssetService {
  constructor(private readonly prisma: PrismaService) {}

  listActive(): Promise<SystemAssetRecord[]> {
    return this.prisma.exportSystemAsset
      .findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      })
      .then((rows) => rows.map((row) => this.toRecord(row)));
  }

  async createFromUpload(
    upload: UploadImageResult,
    file: Express.Multer.File,
    opts?: {
      name?: string;
      category?: ExportSystemAssetCategory;
      uploadedByUserId?: number;
    },
  ): Promise<SystemAssetRecord> {
    const name = this.resolveName(opts?.name, file.originalname);
    const row = await this.prisma.exportSystemAsset.create({
      data: {
        name,
        category: opts?.category ?? ExportSystemAssetCategory.OTHER,
        access: ExportSystemAssetAccess.FREE,
        provider: upload.provider,
        storageKey: upload.key,
        url: upload.url,
        mimeType: file.mimetype,
        width: upload.width ?? null,
        height: upload.height ?? null,
        bytes: upload.bytes ?? file.size,
        uploadedByUserId: opts?.uploadedByUserId ?? null,
      },
    });
    return this.toRecord(row);
  }

  async findById(id: number) {
    const row = await this.prisma.exportSystemAsset.findUnique({
      where: { id },
    });
    if (!row) {
      throw new NotFoundException('Không tìm thấy ảnh thư viện');
    }
    return row;
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prisma.exportSystemAsset.delete({ where: { id } });
    return { ok: true as const };
  }

  static categoryFromApi(
    value?: string,
  ): ExportSystemAssetCategory | undefined {
    if (!value) return undefined;
    return API_TO_CATEGORY[value as SystemAssetRecord['category']];
  }

  private resolveName(input: string | undefined, originalName: string): string {
    const trimmed = input?.trim();
    if (trimmed) return trimmed.slice(0, 120);
    const base = originalName.replace(/\.[^.]+$/, '').trim();
    return (base || 'Ảnh trang trí').slice(0, 120);
  }

  private toRecord(
    row: Prisma.ExportSystemAssetGetPayload<object>,
  ): SystemAssetRecord {
    return {
      id: row.id,
      name: row.name,
      category: CATEGORY_TO_API[row.category],
      access: row.access === ExportSystemAssetAccess.PAID ? 'paid' : 'free',
      provider: row.provider as SystemAssetRecord['provider'],
      key: row.storageKey,
      url: row.url,
      mimeType: row.mimeType,
      width: row.width,
      height: row.height,
      bytes: row.bytes,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
