import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { SystemGuard } from '../auth/system.guard.js';
import { DeleteMediaImageDto } from './dto/delete-media-image.dto.js';
import { CreateSystemAssetDto } from './dto/create-system-asset.dto.js';
import { DeleteSystemAssetDto } from './dto/delete-system-asset.dto.js';
import { MediaService } from './media.service.js';
import { SystemAssetService } from './system-asset.service.js';

interface AuthenticatedRequest {
  user?: { id: number };
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images')
  @UseGuards(SystemGuard)
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
  @UseGuards(SystemGuard)
  deleteImage(@Body() body: DeleteMediaImageDto) {
    return this.mediaService.deleteImage(body);
  }

  @Get('system-assets')
  @UseGuards(JwtRequiredGuard)
  listSystemAssets() {
    return this.mediaService.listSystemAssets();
  }

  @Post('system-assets')
  @UseGuards(SystemGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  uploadSystemAsset(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateSystemAssetDto,
  ) {
    return this.mediaService.uploadSystemAsset(file, {
      name: body.name,
      category: SystemAssetService.categoryFromApi(body.category),
      uploadedByUserId: req.user?.id,
    });
  }

  @Delete('system-assets')
  @UseGuards(SystemGuard)
  deleteSystemAsset(@Body() body: DeleteSystemAssetDto) {
    return this.mediaService.deleteSystemAsset(body.id);
  }
}
