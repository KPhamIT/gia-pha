import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { SetContributionDto } from './dto/set-contribution.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/contribution')
  setContribution(@Param('id') id: string, @Body() dto: SetContributionDto) {
    return this.eventService.setContribution(+id, dto.personId, dto.paid);
  }
}
