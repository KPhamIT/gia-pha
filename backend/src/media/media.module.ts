import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { CloudinaryStorageService } from './providers/cloudinary-storage.service.js';
import { LocalStorageService } from './providers/local-storage.service.js';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryStorageService, LocalStorageService],
  exports: [MediaService],
})
export class MediaModule {}
