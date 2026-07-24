import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  assertOrgAccess,
  assertOrgMemberAccess,
} from '../auth/org-access.js';
import type { UpsertClanDutyYearDto } from './dto/upsert-clan-duty-year.dto.js';

export type ClanDutyCeremonyLink = {
  templateId: number;
  name: string;
};

export type ClanDutyEntryView = {
  id: number;
  personId: number;
  fullName: string;
  generation: number | null;
  branch: number | null;
  role: string | null;
  note: string | null;
  sortOrder: number;
  ceremonyLinks: ClanDutyCeremonyLink[];
};

export type ClanDutyYearView = {
  id: number;
  year: number;
  note: string | null;
  entries: ClanDutyEntryView[];
};

const entryInclude = {
  entries: {
    orderBy: [{ sortOrder: 'asc' as const }, { id: 'asc' as const }],
    include: {
      person: {
        select: {
          id: true,
          fullName: true,
          generation: true,
          branch: true,
        },
      },
    },
  },
};

@Injectable()
export class ClanDutyService {
  constructor(private readonly prisma: PrismaService) {}

  async listYears(user: User): Promise<{ year: number; entryCount: number }[]> {
    const organizationId = this.resolveOrganizationId(user, false);
    const rows = await this.prisma.clanDutyYear.findMany({
      where: { organizationId },
      orderBy: { year: 'desc' },
      include: { _count: { select: { entries: true } } },
    });
    return rows.map((row) => ({
      year: row.year,
      entryCount: row._count.entries,
    }));
  }

  async getYear(user: User, year: number): Promise<ClanDutyYearView> {
    const organizationId = this.resolveOrganizationId(user, false);
    assertYear(year);
    const row = await this.prisma.clanDutyYear.findUnique({
      where: { organizationId_year: { organizationId, year } },
      include: entryInclude,
    });
    if (!row) {
      return { id: 0, year, note: null, entries: [] };
    }
    return this.toYearView(organizationId, row);
  }

  async upsertYear(
    user: User,
    year: number,
    dto: UpsertClanDutyYearDto,
  ): Promise<ClanDutyYearView> {
    const organizationId = this.resolveOrganizationId(user, true);
    assertYear(year);

    const entryPersonIds = dto.entries.map((e) => e.personId);
    const ceremonyTemplateIds = dto.entries.flatMap((e) =>
      normalizeIds(e.ceremonyTemplateIds),
    );
    await this.assertPersonsInOrg(organizationId, entryPersonIds);
    await this.assertTemplatesAccessible(organizationId, ceremonyTemplateIds);

    const uniquePersonIds = new Set(entryPersonIds);
    if (uniquePersonIds.size !== dto.entries.length) {
      throw new BadRequestException('Duplicate person in duty list');
    }

    const yearRow = await this.prisma.$transaction(async (tx) => {
      const dutyYear = await tx.clanDutyYear.upsert({
        where: { organizationId_year: { organizationId, year } },
        create: {
          organizationId,
          year,
          note: dto.note?.trim() || null,
        },
        update: { note: dto.note?.trim() || null },
      });

      await tx.clanDutyEntry.deleteMany({ where: { dutyYearId: dutyYear.id } });

      if (dto.entries.length > 0) {
        await tx.clanDutyEntry.createMany({
          data: dto.entries.map((entry, index) => ({
            dutyYearId: dutyYear.id,
            personId: entry.personId,
            role: entry.role?.trim() || null,
            note: entry.note?.trim() || null,
            sortOrder: entry.sortOrder ?? index,
            ceremonyTemplateIds: normalizeIds(entry.ceremonyTemplateIds),
          })),
        });
      }

      return tx.clanDutyYear.findUniqueOrThrow({
        where: { id: dutyYear.id },
        include: entryInclude,
      });
    });

    return this.toYearView(organizationId, yearRow);
  }

  async removeYear(user: User, year: number): Promise<{ ok: true }> {
    const organizationId = this.resolveOrganizationId(user, true);
    assertYear(year);
    const existing = await this.prisma.clanDutyYear.findUnique({
      where: { organizationId_year: { organizationId, year } },
    });
    if (!existing) throw new NotFoundException('Duty year not found');
    await this.prisma.clanDutyYear.delete({ where: { id: existing.id } });
    return { ok: true };
  }

  private resolveOrganizationId(user: User, requireAdmin: boolean): number {
    if (user.organizationId == null) {
      throw new BadRequestException('User has no organization');
    }
    if (requireAdmin) {
      assertOrgAccess(user, user.organizationId);
    } else {
      assertOrgMemberAccess(user, user.organizationId);
    }
    return user.organizationId;
  }

  private async assertPersonsInOrg(
    organizationId: number,
    personIds: number[],
  ): Promise<void> {
    const unique = [...new Set(personIds)];
    if (unique.length === 0) return;
    const count = await this.prisma.person.count({
      where: { organizationId, id: { in: unique } },
    });
    if (count !== unique.length) {
      throw new BadRequestException('Person not in organization');
    }
  }

  private async assertTemplatesAccessible(
    organizationId: number,
    templateIds: number[],
  ): Promise<void> {
    const unique = [...new Set(templateIds)];
    if (unique.length === 0) return;
    const count = await this.prisma.ceremonyTemplate.count({
      where: {
        id: { in: unique },
        OR: [{ isSystemTemplate: true }, { organizationId }],
      },
    });
    if (count !== unique.length) {
      throw new BadRequestException('Ceremony template not found');
    }
  }

  private async toYearView(
    organizationId: number,
    row: {
      id: number;
      year: number;
      note: string | null;
      entries: {
        id: number;
        personId: number;
        role: string | null;
        note: string | null;
        sortOrder: number;
        ceremonyTemplateIds: unknown;
        person: {
          id: number;
          fullName: string;
          generation: number | null;
          branch: number | null;
        };
      }[];
    },
  ): Promise<ClanDutyYearView> {
    const nameById = await this.loadTemplateNames(
      organizationId,
      row.entries,
    );
    return {
      id: row.id,
      year: row.year,
      note: row.note,
      entries: row.entries.map((entry) => ({
        id: entry.id,
        personId: entry.personId,
        fullName: entry.person.fullName,
        generation: entry.person.generation,
        branch: entry.person.branch,
        role: entry.role,
        note: entry.note,
        sortOrder: entry.sortOrder,
        ceremonyLinks: normalizeIds(entry.ceremonyTemplateIds).map((id) => ({
          templateId: id,
          name: nameById.get(id) ?? `#${id}`,
        })),
      })),
    };
  }

  private async loadTemplateNames(
    organizationId: number,
    entries: { ceremonyTemplateIds: unknown }[],
  ): Promise<Map<number, string>> {
    const ids = [
      ...new Set(entries.flatMap((e) => normalizeIds(e.ceremonyTemplateIds))),
    ];
    if (ids.length === 0) return new Map();
    const templates = await this.prisma.ceremonyTemplate.findMany({
      where: {
        id: { in: ids },
        OR: [{ isSystemTemplate: true }, { organizationId }],
      },
      select: { id: true, name: true },
    });
    return new Map(templates.map((t) => [t.id, t.name]));
  }
}

function assertYear(year: number) {
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new BadRequestException('Invalid year');
  }
}

function normalizeIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const out: number[] = [];
  const seen = new Set<number>();
  for (const item of value) {
    const id = typeof item === 'number' ? item : Number(item);
    if (!Number.isInteger(id) || id <= 0 || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}
