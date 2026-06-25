import type { MediaDriver } from './media.types.js';

export function getMediaDriver(): MediaDriver {
  const raw = process.env.MEDIA_DRIVER?.trim().toLowerCase();
  if (raw === 'cloudinary') return 'cloudinary';
  return 'local';
}

export function getMediaPublicBaseUrl(): string {
  const raw =
    process.env.MEDIA_BASE_URL?.trim() ||
    process.env.PUBLIC_API_URL?.trim() ||
    '';

  if (raw) {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw.replace(/\/$/, '');
    }
    return `https://${raw.replace(/\/$/, '')}`;
  }

  const port = process.env.PORT ?? '5000';
  return `http://localhost:${port}`;
}
