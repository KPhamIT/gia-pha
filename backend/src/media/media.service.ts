import { BadRequestException, Injectable } from '@nestjs/common';
import { getMediaDriver } from './media.config.js';
import { DeleteMediaImageDto } from './dto/delete-media-image.dto.js';
import { CloudinaryStorageService } from './providers/cloudinary-storage.service.js';
import { LocalStorageService } from './providers/local-storage.service.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudinaryStorage: CloudinaryStorageService,
    private readonly localStorage: LocalStorageService,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    this.assertValidImage(file);
    const provider =
      getMediaDriver() === 'cloudinary'
        ? this.cloudinaryStorage
        : this.localStorage;
    return provider.uploadImage(file, { folder: 'blog' });
  }

  async deleteImage(body: DeleteMediaImageDto) {
    if (body.provider === 'cloudinary') {
      await this.cloudinaryStorage.deleteImage(body.key);
      return { ok: true };
    }
    await this.localStorage.deleteImage(body.key);
    return { ok: true };
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
}
