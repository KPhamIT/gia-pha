import { Module } from '@nestjs/common';
import { StandardFeaturesModule } from '../standard-features/standard-features.module.js';
import { ExportPresetService } from './export-preset.service.js';
import { ExportPresetController } from './export-preset.controller.js';

@Module({
  imports: [StandardFeaturesModule],
  controllers: [ExportPresetController],
  providers: [ExportPresetService],
})
export class ExportPresetModule {}
