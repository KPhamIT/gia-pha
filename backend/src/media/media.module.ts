import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { SystemAssetService } from './system-asset.service.js';
import { CloudinaryStorageService } from './providers/cloudinary-storage.service.js';
import { LocalStorageService } from './providers/local-storage.service.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    SystemAssetService,
    CloudinaryStorageService,
    LocalStorageService,
  ],
  exports: [MediaService],
})
export class MediaModule {}
