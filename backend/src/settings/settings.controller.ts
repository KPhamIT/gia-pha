import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

interface AuthenticatedRequest {
  user?: { id: number };
}

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findMine(@Request() req: AuthenticatedRequest) {
    if (!req.user) throw new UnauthorizedException();
    return this.settingsService.findByUserId(req.user.id);
  }

  @Put()
  upsert(
    @Request() req: AuthenticatedRequest,
    @Body() body: Record<string, unknown>,
  ) {
    if (!req.user) throw new UnauthorizedException();
    return this.settingsService.upsert(req.user.id, body);
  }
}
