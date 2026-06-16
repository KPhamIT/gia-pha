import { Body, Controller, Get, Put, Request } from '@nestjs/common';
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

  @Put()
  replaceMine(@Request() req: AuthenticatedRequest, @Body() body: unknown) {
    return this.exportPresetService.replaceMine(req.user?.id, body);
  }
}
