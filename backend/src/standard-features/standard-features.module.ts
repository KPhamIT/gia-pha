import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { FeatureMutateGuard } from './feature-mutate.guard.js';
import { StandardFeaturesController } from './standard-features.controller.js';
import { StandardFeaturesService } from './standard-features.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [StandardFeaturesController],
  providers: [StandardFeaturesService, FeatureMutateGuard],
  exports: [StandardFeaturesService, FeatureMutateGuard],
})
export class StandardFeaturesModule {}
