import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { DayNotesService } from './day-notes.service.js';
import { UpsertDayNoteDto } from './dto/upsert-day-note.dto.js';

@Controller('day-notes')
@UseGuards(JwtRequiredGuard)
export class DayNotesController {
  constructor(private readonly dayNotesService: DayNotesService) {}

  @Get()
  list(
    @Request() req: { user: User },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dayNotesService.list(req.user, from, to);
  }

  @Put(':date')
  upsert(
    @Request() req: { user: User },
    @Param('date') date: string,
    @Body() dto: UpsertDayNoteDto,
  ) {
    return this.dayNotesService.upsert(req.user, date, dto.body);
  }

  @Delete(':date')
  remove(@Request() req: { user: User }, @Param('date') date: string) {
    return this.dayNotesService.remove(req.user, date);
  }
}
