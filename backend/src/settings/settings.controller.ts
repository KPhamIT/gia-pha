import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { FeatureMutateGuard } from '../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../standard-features/require-feature.decorator.js';
import { SettingsService } from './settings.service.js';

interface AuthenticatedRequest {
  user?: { id: number };
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findMine(@Request() req: AuthenticatedRequest) {
    return this.settingsService.findForRequest(req.user?.id);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('settings')
  @Put()
  upsert(
    @Request() req: AuthenticatedRequest,
    @Body() body: Record<string, unknown>,
  ) {
    return this.settingsService.upsertForRequest(req.user?.id, body);
  }
}
