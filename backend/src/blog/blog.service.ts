import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogCategory } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateBlogPostDto } from './dto/create-blog-post.dto.js';
import type { UpdateBlogPostDto } from './dto/update-blog-post.dto.js';

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

const adminListSelect = {
  ...listSelect,
  published: true,
  metaDescription: true,
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

  listAdmin() {
    return this.prisma.blogPost.findMany({
      select: adminListSelect,
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findById(id: number) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    return post;
  }

  async create(dto: CreateBlogPostDto) {
    await this.assertSlugAvailable(dto.slug);
    return this.prisma.blogPost.create({
      data: this.toCreateData(dto),
    });
  }

  async update(id: number, dto: UpdateBlogPostDto) {
    await this.findById(id);
    if (dto.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }
    return this.prisma.blogPost.update({
      where: { id },
      data: this.toUpdateData(dto),
    });
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prisma.blogPost.delete({ where: { id } });
    return { ok: true };
  }

  private async assertSlugAvailable(slug: string, excludeId?: number) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Slug đã tồn tại');
    }
  }

  private toCreateData(dto: CreateBlogPostDto) {
    return {
      title: dto.title.trim(),
      slug: dto.slug.trim(),
      excerpt: dto.excerpt,
      content: dto.content,
      metaDescription: dto.metaDescription.trim(),
      category: dto.category,
      tags: dto.tags ?? [],
      published: dto.published ?? true,
      ...(dto.publishedAt ? { publishedAt: new Date(dto.publishedAt) } : {}),
    };
  }

  private toUpdateData(dto: UpdateBlogPostDto) {
    return {
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.slug !== undefined ? { slug: dto.slug.trim() } : {}),
      ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
      ...(dto.content !== undefined ? { content: dto.content } : {}),
      ...(dto.metaDescription !== undefined
        ? { metaDescription: dto.metaDescription.trim() }
        : {}),
      ...(dto.category !== undefined ? { category: dto.category } : {}),
      ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
      ...(dto.published !== undefined ? { published: dto.published } : {}),
      ...(dto.publishedAt !== undefined
        ? { publishedAt: new Date(dto.publishedAt) }
        : {}),
    };
  }
}
