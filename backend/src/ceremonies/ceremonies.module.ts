import { Module } from '@nestjs/common';
import { OrganizationModule } from '../organization/organization.module.js';
import { CeremoniesController } from './ceremonies.controller.js';
import { CeremoniesService } from './ceremonies.service.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';

@Module({
  imports: [OrganizationModule],
  controllers: [CeremoniesController],
  providers: [CeremoniesService, CeremonyTemplatesService],
})
export class CeremoniesModule {}
