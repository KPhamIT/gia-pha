import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RelationshipService } from './relationship.service.js';
import { CreateRelationshipDto } from './dto/create-relationship.dto.js';
import { FeatureMutateGuard } from '../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../standard-features/require-feature.decorator.js';

@Controller('relationship')
export class RelationshipController {
  constructor(private readonly relationshipService: RelationshipService) {}

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Post()
  async create(@Body() dto: CreateRelationshipDto) {
    return this.relationshipService.create(dto);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.relationshipService.remove(+id);
  }

  @Get()
  async findAll() {
    return this.relationshipService.findAll();
  }
}
