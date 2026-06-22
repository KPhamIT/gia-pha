import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { MutateGuard } from '../auth/mutate.guard.js';
import { SystemGuard } from '../auth/system.guard.js';
import { UpdateStandardFeaturesDto } from './dto/update-standard-features.dto.js';
import { StandardFeaturesService } from './standard-features.service.js';

@Controller()
export class StandardFeaturesController {
  constructor(
    private readonly standardFeaturesService: StandardFeaturesService,
  ) {}

  @Get('standard-features/defaults')
  @UseGuards(SystemGuard)
  getDefaults() {
    return this.standardFeaturesService.getSystemDefaults();
  }

  @Patch('standard-features/defaults')
  @UseGuards(SystemGuard)
  updateDefaults(@Body() body: UpdateStandardFeaturesDto) {
    return this.standardFeaturesService.updateSystemDefaults(body.features);
  }

  @Get('organizations/:id/standard-features')
  @UseGuards(MutateGuard)
  getOrgFeatures(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
  ) {
    return this.standardFeaturesService.getOrgConfig(id, req.user);
  }

  @Patch('organizations/:id/standard-features')
  @UseGuards(MutateGuard)
  updateOrgFeatures(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
    @Body() body: UpdateStandardFeaturesDto,
  ) {
    return this.standardFeaturesService.updateOrgOverrides(
      id,
      req.user,
      body.features,
    );
  }
}
