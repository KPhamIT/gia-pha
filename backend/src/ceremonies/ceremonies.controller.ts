import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { MutateGuard } from '../auth/mutate.guard.js';
import { CeremoniesService } from './ceremonies.service.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';
import {
  CreateCeremonyTemplateDto,
  UpdateCeremonyTemplateDto,
} from './dto/ceremony-template.dto.js';
import { CEREMONY_TEMPLATE_VARIABLES } from './ceremony-template.js';

@Controller('ceremonies')
export class CeremoniesController {
  constructor(
    private readonly ceremoniesService: CeremoniesService,
    private readonly ceremonyTemplatesService: CeremonyTemplatesService,
  ) {}

  @Get('templates/variables')
  @UseGuards(JwtRequiredGuard)
  listVariables() {
    return CEREMONY_TEMPLATE_VARIABLES;
  }

  @Get('templates')
  @UseGuards(JwtRequiredGuard)
  listTemplates(@Request() req: { user: User }) {
    return this.ceremonyTemplatesService.list(req.user);
  }

  @Get('templates/:id')
  @UseGuards(JwtRequiredGuard)
  getTemplate(@Request() req: { user: User }, @Param('id') id: string) {
    return this.ceremonyTemplatesService.findOne(req.user, +id);
  }

  @Post('templates')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  createTemplate(
    @Request() req: { user: User },
    @Body() dto: CreateCeremonyTemplateDto,
  ) {
    return this.ceremonyTemplatesService.create(req.user, dto);
  }

  @Patch('templates/:id')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  updateTemplate(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateCeremonyTemplateDto,
  ) {
    return this.ceremonyTemplatesService.update(req.user, +id, dto);
  }

  @Patch('templates/:id/default')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  setDefaultTemplate(@Request() req: { user: User }, @Param('id') id: string) {
    return this.ceremonyTemplatesService.setDefault(req.user, +id);
  }

  @Delete('templates/:id')
  @UseGuards(JwtRequiredGuard, MutateGuard)
  removeTemplate(@Request() req: { user: User }, @Param('id') id: string) {
    return this.ceremonyTemplatesService.remove(req.user, +id);
  }

  @Get('public/:token/html')
  renderPublicHtml(@Param('token') token: string) {
    return this.ceremoniesService.renderCeremonyHtmlByShareToken(token);
  }

  @Get(':personId/share-token')
  @UseGuards(JwtRequiredGuard)
  getShareToken(
    @Request() req: { user: User },
    @Param('personId') personId: string,
  ) {
    return this.ceremoniesService.createShareToken(req.user, +personId);
  }

  @Get(':personId/html')
  @UseGuards(JwtRequiredGuard)
  renderHtml(
    @Request() req: { user: User },
    @Param('personId') personId: string,
    @Query('templateId') templateId?: string,
  ) {
    return this.ceremoniesService.renderCeremonyHtml(
      req.user,
      +personId,
      templateId ? +templateId : undefined,
    );
  }
}
