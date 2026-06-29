import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import type { MediaStorageService, UploadImageResult } from '../media.types.js';

const SYSTEM_FOLDER = 'gia-pha/system';

@Injectable()
export class CloudinaryStorageService implements MediaStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    opts?: { folder?: string },
  ): Promise<UploadImageResult> {
    const folder =
      opts?.folder === 'system'
        ? SYSTEM_FOLDER
        : opts?.folder
          ? `gia-pha/${opts.folder}`
          : 'gia-pha/blog';
    const uploaded = await this.uploadToCloudinary(file.buffer, folder);
    return {
      provider: 'cloudinary',
      key: uploaded.public_id,
      url: uploaded.secure_url,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
    };
  }

  async deleteImage(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key, { resource_type: 'image' });
  }

  private uploadToCloudinary(
    buffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(
              new InternalServerErrorException('Upload ảnh Cloudinary thất bại'),
            );
            return;
          }
          resolve(result);
        },
      );
      stream.end(buffer);
    });
  }
}
