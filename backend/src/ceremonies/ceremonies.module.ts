import { Module } from '@nestjs/common';
import { OrganizationModule } from '../organization/organization.module.js';
import { CeremoniesController } from './ceremonies.controller.js';
import { CeremoniesService } from './ceremonies.service.js';
import { CeremonyPrintBookController } from './ceremony-print-book.controller.js';
import { CeremonyPrintBookService } from './ceremony-print-book.service.js';
import { CeremonyPublicController } from './ceremony-public.controller.js';
import { CeremonyPublicService } from './ceremony-public.service.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';

@Module({
  imports: [OrganizationModule],
  controllers: [
    CeremoniesController,
    CeremonyPublicController,
    CeremonyPrintBookController,
  ],
  providers: [
    CeremoniesService,
    CeremonyTemplatesService,
    CeremonyPublicService,
    CeremonyPrintBookService,
  ],
})
export class CeremoniesModule {}
