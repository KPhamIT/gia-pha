import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { CronGuard } from '../auth/cron.guard.js';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { MutateGuard } from '../auth/mutate.guard.js';
import { NotificationsService } from './notifications.service.js';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** Triggered by GitHub Actions or manual HTTP call — see docs/cron-github-actions.md */
  @Post('cron/death-anniversary')
  @UseGuards(CronGuard)
  runDeathAnniversaryCron() {
    return this.notificationsService.runDeathAnniversaryCron();
  }

  @Get('settings')
  @UseGuards(JwtRequiredGuard)
  getSettings(@Request() req: { user: User }) {
    return this.notificationsService.getSettings(req.user);
  }

  @Patch('settings')
  @UseGuards(JwtRequiredGuard)
  updateSettings(
    @Request() req: { user: User },
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.notificationsService.updateSettings(req.user, dto);
  }

  @Get()
  @UseGuards(JwtRequiredGuard)
  list(@Request() req: { user: User }) {
    return this.notificationsService.listForUser(req.user);
  }

  @Get('stats')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  stats(@Request() req: { user: User }) {
    return this.notificationsService.getOrgStats(req.user);
  }

  @Get('upcoming')
  @UseGuards(JwtRequiredGuard)
  upcoming(@Request() req: { user: User }) {
    return this.notificationsService.listUpcomingCeremonies(req.user);
  }

  @Get('upcoming/:personId')
  @UseGuards(JwtRequiredGuard)
  upcomingOne(@Request() req: { user: User }, @Param('personId') personId: string) {
    return this.notificationsService.getUpcomingCeremony(req.user, +personId);
  }
}
