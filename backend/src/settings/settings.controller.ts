import { Body, Controller, Get, Put, Query, Request, UseGuards } from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { JwtOptionalGuard } from '../auth/jwt-optional.guard.js';
import { FeatureMutateGuard } from '../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../standard-features/require-feature.decorator.js';
import { SettingsService } from './settings.service.js';

interface AuthenticatedRequest {
  user?: User;
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtOptionalGuard)
  findMine(
    @Request() req: AuthenticatedRequest,
    @Query('orgToken') orgToken?: string,
  ) {
    if (req.user?.id) {
      return this.settingsService.findByUserId(req.user.id);
    }

    if (!orgToken) return null;

    return this.settingsService.findForGuest(orgToken);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('settings')
  @Put()
  upsert(
    @Request() req: AuthenticatedRequest,
    @Body() body: Record<string, unknown>,
  ) {
    return this.settingsService.upsert(req.user!.id, body);
  }
}
