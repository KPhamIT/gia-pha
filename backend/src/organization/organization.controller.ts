import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
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
