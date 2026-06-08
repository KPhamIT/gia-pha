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
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('relationship')
export class RelationshipController {
  constructor(private readonly relationshipService: RelationshipService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRelationshipDto) {
    return this.relationshipService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.relationshipService.remove(+id);
  }

  @Get()
  async findAll() {
    return this.relationshipService.findAll();
  }
}
