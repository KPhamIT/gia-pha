import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RelationshipService } from './relationship.service.js';
import { RelationshipController } from './relationship.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [RelationshipService],
  controllers: [RelationshipController],
})
export class RelationshipModule {}
