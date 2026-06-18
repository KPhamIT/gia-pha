import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrganizationModule } from '../organization/organization.module.js';
import { StandardFeaturesModule } from '../standard-features/standard-features.module.js';
import { PersonService } from './person.service.js';
import { PersonController } from './person.controller.js';

@Module({
  imports: [PrismaModule, OrganizationModule, StandardFeaturesModule],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
