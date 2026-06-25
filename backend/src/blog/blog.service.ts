import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCategory } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const listSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  tags: true,
  publishedAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  list(category?: BlogCategory) {
    return this.prisma.blogPost.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      select: listSelect,
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }

  listSlugs() {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, published: true },
    });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    return post;
  }
}
