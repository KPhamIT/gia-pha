import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  isPublishableCeremony,
  publicCeremonySlug,
} from './ceremony-public.js';

const PUBLIC_FIELDS = {
  id: true,
  name: true,
  printTitle: true,
  content: true,
  intro: true,
  meaning: true,
  preparation: true,
  sourceBookTitle: true,
  seoSlug: true,
  seoTitle: true,
  seoDescription: true,
  seoExcerpt: true,
  seoKeywords: true,
  updatedAt: true,
} as const;

@Injectable()
export class CeremonyPublicService {
  constructor(private readonly prisma: PrismaService) {}

  private async loadPublishable() {
    const items = await this.prisma.ceremonyTemplate.findMany({
      where: { isSystemTemplate: true },
      select: PUBLIC_FIELDS,
      orderBy: { id: 'asc' },
    });
    return items
      .filter(isPublishableCeremony)
      .map((item) => ({ ...item, slug: publicCeremonySlug(item) }));
  }

  /** Danh sách tóm tắt cho trang /van-khan và sitemap. */
  async list() {
    const items = await this.loadPublishable();
    return items.map(({ content: _content, ...summary }) => summary);
  }

  async findBySlug(slug: string) {
    const items = await this.loadPublishable();
    const found = items.find((item) => item.slug === slug);
    if (!found) throw new NotFoundException('Ceremony template not found');
    return found;
  }
}
