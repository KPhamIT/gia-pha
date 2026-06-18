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
import { FeatureMutateGuard } from '../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../standard-features/require-feature.decorator.js';

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

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.update(+id, dto);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Put(':id/contribution')
  setContributions(@Param('id') id: string, @Body() dto: SetContributionsDto) {
    return this.eventService.setContributions(+id, dto.contributions);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Put(':id/donation')
  setDonations(@Param('id') id: string, @Body() dto: SaveDonationsDto) {
    return this.eventService.setDonations(+id, dto);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Post(':id/donation')
  addDonation(@Param('id') id: string, @Body() dto: CreateDonationDto) {
    return this.eventService.addDonation(+id, dto);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Patch(':id/donation/:donationId')
  updateDonation(
    @Param('id') id: string,
    @Param('donationId') donationId: string,
    @Body() dto: UpdateDonationDto,
  ) {
    return this.eventService.updateDonation(+id, +donationId, dto);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editEvents')
  @Delete(':id/donation/:donationId')
  removeDonation(
    @Param('id') id: string,
    @Param('donationId') donationId: string,
  ) {
    return this.eventService.removeDonation(+id, +donationId);
  }
}
