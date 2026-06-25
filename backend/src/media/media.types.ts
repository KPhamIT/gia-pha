export type MediaDriver = 'cloudinary' | 'local';

export type UploadImageResult = {
  provider: MediaDriver;
  key: string;
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export interface MediaStorageService {
  uploadImage(
    file: Express.Multer.File,
    opts?: { folder?: string },
  ): Promise<UploadImageResult>;
  deleteImage(key: string): Promise<void>;
}
