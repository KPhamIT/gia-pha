import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { JwtOptionalGuard } from '../auth/jwt-optional.guard.js';
import { MutateGuard } from '../auth/mutate.guard.js';
import { SystemGuard } from '../auth/system.guard.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { OrganizationService } from './organization.service.js';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @UseGuards(MutateGuard)
  list(@Request() req: { user: User }) {
    return this.organizationService.listForUser(req.user);
  }

  @Get('access-link')
  @UseGuards(MutateGuard)
  accessLink(
    @Request() req: { user: User },
    @Query('organizationId') organizationId?: string,
  ) {
    const orgId = organizationId
      ? Number.parseInt(organizationId, 10)
      : undefined;
    if (orgId != null && Number.isNaN(orgId)) {
      throw new BadRequestException('Invalid organizationId');
    }
    return this.organizationService.getAccessLinkForUser(req.user, orgId);
  }

  @Get('public/:token')
  @UseGuards(JwtOptionalGuard)
  resolvePublic(@Param('token') token: string) {
    return this.organizationService.resolvePublicByToken(token);
  }

  @Post()
  @UseGuards(SystemGuard)
  create(@Body() body: CreateOrganizationDto) {
    return this.organizationService.create(body);
  }

  @Patch(':id')
  @UseGuards(MutateGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
    @Body() body: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, req.user, body);
  }

  @Delete(':id')
  @UseGuards(SystemGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.remove(id);
  }
}
