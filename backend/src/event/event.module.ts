import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EventService } from './event.service.js';
import { EventController } from './event.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
