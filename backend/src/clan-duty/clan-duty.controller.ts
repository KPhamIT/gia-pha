import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { MutateGuard } from '../auth/mutate.guard.js';
import { ClanDutyService } from './clan-duty.service.js';
import { UpsertClanDutyYearDto } from './dto/upsert-clan-duty-year.dto.js';

@Controller('clan-duty')
export class ClanDutyController {
  constructor(private readonly clanDutyService: ClanDutyService) {}

  @Get('years')
  @UseGuards(JwtRequiredGuard)
  listYears(@Request() req: { user: User }) {
    return this.clanDutyService.listYears(req.user);
  }

  @Get(':year')
  @UseGuards(JwtRequiredGuard)
  getYear(@Request() req: { user: User }, @Param('year') year: string) {
    return this.clanDutyService.getYear(req.user, Number(year));
  }

  /** Chỉ ADMIN dòng họ / SYSTEM. */
  @Put(':year')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  upsertYear(
    @Request() req: { user: User },
    @Param('year') year: string,
    @Body() dto: UpsertClanDutyYearDto,
  ) {
    return this.clanDutyService.upsertYear(req.user, Number(year), dto);
  }

  @Delete(':year')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  removeYear(@Request() req: { user: User }, @Param('year') year: string) {
    return this.clanDutyService.removeYear(req.user, Number(year));
  }
}
