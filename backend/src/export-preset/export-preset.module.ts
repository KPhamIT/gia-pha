import { Module } from '@nestjs/common';
import { ExportPresetService } from './export-preset.service.js';
import { ExportPresetController } from './export-preset.controller.js';

@Module({
  controllers: [ExportPresetController],
  providers: [ExportPresetService],
})
export class ExportPresetModule {}
