import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrganizationModule } from '../organization/organization.module.js';
import { StandardFeaturesModule } from '../standard-features/standard-features.module.js';
import { EventService } from './event.service.js';
import { EventController } from './event.controller.js';

@Module({
  imports: [PrismaModule, OrganizationModule, StandardFeaturesModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
