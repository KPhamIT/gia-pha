import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { FeatureMutateGuard } from '../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../standard-features/require-feature.decorator.js';
import { ExportPresetService } from './export-preset.service.js';

interface AuthenticatedRequest {
  user?: { id: number };
}

@Controller('export-preset')
export class ExportPresetController {
  constructor(private readonly exportPresetService: ExportPresetService) {}

  @Get()
  findMine(@Request() req: AuthenticatedRequest) {
    return this.exportPresetService.findMine(req.user?.id);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('export')
  @Put()
  replaceMine(@Request() req: AuthenticatedRequest, @Body() body: unknown) {
    return this.exportPresetService.replaceMine(req.user?.id, body);
  }
}
