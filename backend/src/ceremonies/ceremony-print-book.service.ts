import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  buildPlaceholderCeremonyVars,
  renderCeremonyTemplate,
  type CeremonyVarGroups,
} from './build-ceremony-vars.js';
import {
  normalizeCeremonyHtml,
  resolveCeremonyPrintTitle,
} from './ceremony-html.js';
import { isPublishableCeremony } from './ceremony-public.js';

/** Chỗ trống để khách tự viết tay khi khấn. */
const BLANK = '…………';

/** Bỏ "Họ" / "Dòng họ" ở đầu: lời khấn đã có sẵn chữ "họ {{organization.name}}". */
function normalizeClanName(clanName?: string): string {
  const name = (clanName ?? '')
    .trim()
    .replace(/^(dòng\s+)?họ\s+/iu, '')
    .trim();
  return name || BLANK;
}

/**
 * Biến cho sách in sẵn: chỉ điền tên dòng họ; mọi thông tin người, ngày âm lịch
 * (kể cả "hôm nay") để dòng chấm vì sách dùng quanh năm.
 */
function printBookVars(clanName?: string): CeremonyVarGroups {
  const vars = buildPlaceholderCeremonyVars(normalizeClanName(clanName), null);
  const blankAll = (group: Record<string, string>) =>
    Object.fromEntries(Object.keys(group).map((key) => [key, BLANK]));
  return {
    ...vars,
    ceremony: blankAll(vars.ceremony),
    today: blankAll(vars.today),
    worshipper: blankAll(vars.worshipper),
  };
}

@Injectable()
export class CeremonyPrintBookService {
  constructor(private readonly prisma: PrismaService) {}

  /** Mọi bài khấn (hệ thống + của người dùng) kèm người tạo, để chọn vào sách. */
  async listTemplates() {
    const items = await this.prisma.ceremonyTemplate.findMany({
      select: {
        id: true,
        name: true,
        printTitle: true,
        content: true,
        seoSlug: true,
        isSystemTemplate: true,
        updatedAt: true,
        organization: { select: { id: true, name: true } },
        createdBy: { select: { id: true, username: true, email: true } },
      },
      orderBy: [{ isSystemTemplate: 'desc' }, { id: 'asc' }],
    });
    return items.map(({ content, seoSlug, ...item }) => ({
      ...item,
      title: resolveCeremonyPrintTitle(item) ?? item.name,
      publishable: isPublishableCeremony({ name: item.name, content, seoSlug }),
    }));
  }

  /** HTML từng bài (đã điền tên dòng họ) theo đúng thứ tự `ids`. */
  async renderBook(ids: number[], clanName?: string) {
    const templates = await this.prisma.ceremonyTemplate.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, printTitle: true, content: true },
    });
    const byId = new Map(templates.map((t) => [t.id, t]));
    const vars = printBookVars(clanName);

    return ids.flatMap((id) => {
      const template = byId.get(id);
      if (!template) return [];
      const title = resolveCeremonyPrintTitle(template) ?? template.name;
      const rendered = renderCeremonyTemplate(template.content, vars);
      return [{ id, title, html: normalizeCeremonyHtml(rendered, { title }) }];
    });
  }
}
