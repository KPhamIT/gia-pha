import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrganizationModule } from '../organization/organization.module.js';
import { StandardFeaturesModule } from '../standard-features/standard-features.module.js';
import { SettingsService } from './settings.service.js';
import { SettingsController } from './settings.controller.js';

@Module({
  imports: [PrismaModule, OrganizationModule, StandardFeaturesModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
