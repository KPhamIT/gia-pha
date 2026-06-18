import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { StandardFeaturesModule } from '../standard-features/standard-features.module.js';
import { RelationshipService } from './relationship.service.js';
import { RelationshipController } from './relationship.controller.js';

@Module({
  imports: [PrismaModule, StandardFeaturesModule],
  providers: [RelationshipService],
  controllers: [RelationshipController],
})
export class RelationshipModule {}
