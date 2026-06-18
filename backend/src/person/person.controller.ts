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
import { FeatureMutateGuard } from '../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../standard-features/require-feature.decorator.js';
import { PersonService } from './person.service.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { UpdatePersonDetailDto } from './dto/update-person-detail.dto.js';
import { JwtOptionalGuard } from '../auth/jwt-optional.guard.js';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Post()
  create(@Body() createPersonDto: CreatePersonDto, @Request() req: { user: User }) {
    return this.personService.create(createPersonDto, req.user);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get('details')
  findAllDetails() {
    return this.personService.findAllDetails();
  }

  @Get('root/tree')
  @UseGuards(JwtOptionalGuard)
  getDefaultFamilyGraph(
    @Request() req: { user?: User | null },
    @Query('organizationId') organizationId?: string,
  ) {
    const orgId = organizationId ? Number.parseInt(organizationId, 10) : undefined;
    return this.personService.getDefaultFamilyGraphForUser(req.user, orgId);
  }

  @Get(':id/tree')
  getFamilyGraph(@Param('id') id: string) {
    return this.personService.getFamilyGraph(+id);
  }

  @Get(':id/detail')
  getPersonDetail(@Param('id') id: string) {
    return this.personService.getPersonDetail(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Patch(':id/detail')
  updatePersonDetail(
    @Param('id') id: string,
    @Body() updatePersonDetailDto: UpdatePersonDetailDto,
    @Request() req: { user: User },
  ) {
    return this.personService.updatePersonDetail(+id, updatePersonDetailDto, req.user);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @Request() req: { user: User },
  ) {
    return this.personService.update(+id, updatePersonDto, req.user);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.personService.remove(+id, req.user);
  }
}
