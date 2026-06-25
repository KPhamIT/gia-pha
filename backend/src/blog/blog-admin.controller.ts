import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SystemGuard } from '../auth/system.guard.js';
import { BlogService } from './blog.service.js';
import { CreateBlogPostDto } from './dto/create-blog-post.dto.js';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto.js';

@Controller('blog/admin')
@UseGuards(SystemGuard)
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  list() {
    return this.blogService.listAdmin();
  }

  @Get(':id')
  byId(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findById(id);
  }

  @Post()
  create(@Body() body: CreateBlogPostDto) {
    return this.blogService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBlogPostDto,
  ) {
    return this.blogService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
