import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogCategory } from '../../generated/prisma/client.js';
import { BlogService } from './blog.service.js';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  list(@Query('category') category?: string) {
    const parsed = parseBlogCategory(category);
    return this.blogService.list(parsed);
  }

  @Get('slugs')
  slugs() {
    return this.blogService.listSlugs();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}

function parseBlogCategory(value?: string): BlogCategory | undefined {
  if (!value) return undefined;
  return Object.values(BlogCategory).includes(value as BlogCategory)
    ? (value as BlogCategory)
    : undefined;
}
