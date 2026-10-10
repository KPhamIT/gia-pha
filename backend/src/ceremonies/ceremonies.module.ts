import { Module } from '@nestjs/common';
import { OrganizationModule } from '../organization/organization.module.js';
import { CeremoniesController } from './ceremonies.controller.js';
import { CeremoniesService } from './ceremonies.service.js';
import { CeremonyPublicController } from './ceremony-public.controller.js';
import { CeremonyPublicService } from './ceremony-public.service.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';

@Module({
  imports: [OrganizationModule],
  controllers: [CeremoniesController, CeremonyPublicController],
  providers: [
    CeremoniesService,
    CeremonyTemplatesService,
    CeremonyPublicService,
  ],
})
export class CeremoniesModule {}
