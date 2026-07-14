import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { JwtOptionalGuard } from '../auth/jwt-optional.guard.js';
import { WeatherService } from './weather.service.js';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /** Dự báo tại từ đường dòng họ (org hiện tại). */
  @Get('clan')
  @UseGuards(JwtOptionalGuard)
  clan(
    @Request() req: { user?: User | null },
    @Query('orgToken') orgToken?: string,
  ) {
    return this.weatherService.getClanForecast(req.user, orgToken);
  }
}
