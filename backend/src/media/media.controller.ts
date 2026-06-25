import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SystemGuard } from '../auth/system.guard.js';
import { DeleteMediaImageDto } from './dto/delete-media-image.dto.js';
import { MediaService } from './media.service.js';

@Controller('media')
@UseGuards(SystemGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.uploadImage(file);
  }

  @Delete('images')
  deleteImage(@Body() body: DeleteMediaImageDto) {
    return this.mediaService.deleteImage(body);
  }
}
