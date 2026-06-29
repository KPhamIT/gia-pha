import { BadRequestException, Injectable } from '@nestjs/common';
import { getMediaDriver } from './media.config.js';
import { DeleteMediaImageDto } from './dto/delete-media-image.dto.js';
import { CloudinaryStorageService } from './providers/cloudinary-storage.service.js';
import { LocalStorageService } from './providers/local-storage.service.js';
import { SystemAssetService } from './system-asset.service.js';
import { ExportSystemAssetCategory } from '../../generated/prisma/client.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_SYSTEM_ASSET_SIZE = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const ALLOWED_SYSTEM_MIME = new Set([...ALLOWED_MIME, 'image/svg+xml']);

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudinaryStorage: CloudinaryStorageService,
    private readonly localStorage: LocalStorageService,
    private readonly systemAssetService: SystemAssetService,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    this.assertValidImage(file);
    return this.getStorage().uploadImage(file, { folder: 'blog' });
  }

  async deleteImage(body: DeleteMediaImageDto) {
    if (body.provider === 'cloudinary') {
      await this.cloudinaryStorage.deleteImage(body.key);
      return { ok: true };
    }
    await this.localStorage.deleteImage(body.key);
    return { ok: true };
  }

  listSystemAssets() {
    return this.systemAssetService.listActive();
  }

  async uploadSystemAsset(
    file: Express.Multer.File,
    opts?: {
      name?: string;
      category?: ExportSystemAssetCategory;
      uploadedByUserId?: number;
    },
  ) {
    this.assertValidSystemAsset(file);
    const upload = await this.getStorage().uploadImage(file, {
      folder: 'system',
    });
    return this.systemAssetService.createFromUpload(upload, file, opts);
  }

  async deleteSystemAsset(id: number) {
    const row = await this.systemAssetService.findById(id);
    if (row.provider === 'cloudinary') {
      await this.cloudinaryStorage.deleteImage(row.storageKey);
    } else {
      await this.localStorage.deleteImage(row.storageKey);
    }
    return this.systemAssetService.remove(id);
  }

  private getStorage() {
    return getMediaDriver() === 'cloudinary'
      ? this.cloudinaryStorage
      : this.localStorage;
  }

  private assertValidImage(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Thiếu file ảnh');
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException('Định dạng ảnh không hỗ trợ');
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Ảnh vượt quá 5MB');
    }
  }

  private assertValidSystemAsset(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Thiếu file ảnh');
    }
    if (!ALLOWED_SYSTEM_MIME.has(file.mimetype)) {
      throw new BadRequestException('Định dạng ảnh không hỗ trợ');
    }
    if (file.size > MAX_SYSTEM_ASSET_SIZE) {
      throw new BadRequestException('Ảnh vượt quá 8MB');
    }
  }
}
