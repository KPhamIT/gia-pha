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
import { SetContributionsDto } from './dto/set-contribution.dto.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';
import { SaveDonationsDto } from './dto/save-donations.dto.js';
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
  setContributions(@Param('id') id: string, @Body() dto: SetContributionsDto) {
    return this.eventService.setContributions(+id, dto.contributions);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/donation')
  setDonations(@Param('id') id: string, @Body() dto: SaveDonationsDto) {
    return this.eventService.setDonations(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/donation')
  addDonation(@Param('id') id: string, @Body() dto: CreateDonationDto) {
    return this.eventService.addDonation(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/donation/:donationId')
  updateDonation(
    @Param('id') id: string,
    @Param('donationId') donationId: string,
    @Body() dto: UpdateDonationDto,
  ) {
    return this.eventService.updateDonation(+id, +donationId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/donation/:donationId')
  removeDonation(
    @Param('id') id: string,
    @Param('donationId') donationId: string,
  ) {
    return this.eventService.removeDonation(+id, +donationId);
  }
}
