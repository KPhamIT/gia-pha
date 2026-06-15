import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { UpdatePersonDetailDto } from './dto/update-person-detail.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
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
  getDefaultFamilyGraph() {
    return this.personService.getDefaultFamilyGraph();
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id/detail')
  updatePersonDetail(
    @Param('id') id: string,
    @Body() updatePersonDetailDto: UpdatePersonDetailDto,
  ) {
    return this.personService.updatePersonDetail(+id, updatePersonDetailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
