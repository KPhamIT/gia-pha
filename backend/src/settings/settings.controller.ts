import { Body, Controller, Get, Put, Request } from '@nestjs/common';
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

  @Put()
  upsert(
    @Request() req: AuthenticatedRequest,
    @Body() body: Record<string, unknown>,
  ) {
    return this.settingsService.upsertForRequest(req.user?.id, body);
  }
}
