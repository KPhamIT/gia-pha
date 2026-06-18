import { Module } from '@nestjs/common';
import { CeremoniesController } from './ceremonies.controller.js';
import { CeremoniesService } from './ceremonies.service.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';

@Module({
  controllers: [CeremoniesController],
  providers: [CeremoniesService, CeremonyTemplatesService],
})
export class CeremoniesModule {}
