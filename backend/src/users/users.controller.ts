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
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(MutateGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers(@Request() req: { user: User }) {
    return this.usersService.listUsers(req.user);
  }

  @Post()
  createUser(@Request() req: { user: User }, @Body() body: CreateUserDto) {
    return this.usersService.createUser(body, req.user);
  }

  @Patch(':id')
  updateUser(
    @Request() req: { user: User },
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, body, req.user);
  }

  @Delete(':id')
  removeUser(@Request() req: { user: User }, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeUser(id, req.user);
  }
}
