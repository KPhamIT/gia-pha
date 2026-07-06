import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogCategory } from '../../generated/prisma/client.js';
import { BlogService } from './blog.service.js';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  list(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsed = parseBlogCategory(category);
    return this.blogService.listPaginated(
      parsed,
      parsePositiveInt(page, 1),
      parsePositiveInt(limit, 12),
    );
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

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
