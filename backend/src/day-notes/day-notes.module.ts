import { Module } from '@nestjs/common';
import { DayNotesController } from './day-notes.controller.js';
import { DayNotesService } from './day-notes.service.js';

@Module({
  controllers: [DayNotesController],
  providers: [DayNotesService],
})
export class DayNotesModule {}
