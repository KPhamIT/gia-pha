import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { getMediaPublicBaseUrl } from '../media.config.js';
import type { MediaStorageService, UploadImageResult } from '../media.types.js';

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

@Injectable()
export class LocalStorageService implements MediaStorageService {
  async uploadImage(
    file: Express.Multer.File,
    opts?: { folder?: string },
  ): Promise<UploadImageResult> {
    const folder = (opts?.folder ?? 'blog').replace(/^\//, '');
    const ext = MIME_EXT[file.mimetype] ?? 'jpg';
    const filename = `${Date.now()}-${randomUUID()}.${ext}`;
    const relativeDir = join('uploads', folder);
    const absoluteDir = join(process.cwd(), relativeDir);
    await mkdir(absoluteDir, { recursive: true });
    const absolutePath = join(absoluteDir, filename);
    await writeFile(absolutePath, file.buffer);

    const relativePath = `${relativeDir}/${filename}`.replace(/\\/g, '/');
    return {
      provider: 'local',
      key: relativePath,
      url: `${getMediaPublicBaseUrl()}/${relativePath}`,
      bytes: file.size,
    };
  }

  async deleteImage(_key: string): Promise<void> {
    const key = _key.replace(/\\/g, '/');
    if (!key.startsWith('uploads/')) return;
    const uploadsRoot = resolve(process.cwd(), 'uploads');
    const targetPath = resolve(process.cwd(), key);
    if (!targetPath.startsWith(uploadsRoot)) return;
    await unlink(targetPath).catch(() => undefined);
  }
}
