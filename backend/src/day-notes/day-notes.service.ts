import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export type DayNoteDto = {
  id: number;
  noteDate: string;
  body: string;
  updatedAt: string;
};

@Injectable()
export class DayNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: User, from?: string, to?: string): Promise<DayNoteDto[]> {
    const where: { userId: number; noteDate?: { gte?: Date; lte?: Date } } = {
      userId: user.id,
    };
    if (from || to) {
      where.noteDate = {};
      if (from) where.noteDate.gte = parseDateOnly(from);
      if (to) where.noteDate.lte = parseDateOnly(to);
    }
    const rows = await this.prisma.dayNote.findMany({
      where,
      orderBy: { noteDate: 'asc' },
    });
    return rows.map(toDto);
  }

  async upsert(user: User, date: string, body: string): Promise<DayNoteDto> {
    assertCanWrite(user);
    const noteDate = parseDateOnly(date);
    const trimmed = body.trim();
    if (!trimmed) {
      throw new BadRequestException('Note body is required');
    }
    const row = await this.prisma.dayNote.upsert({
      where: { userId_noteDate: { userId: user.id, noteDate } },
      create: { userId: user.id, noteDate, body: trimmed },
      update: { body: trimmed },
    });
    return toDto(row);
  }

  async remove(user: User, date: string): Promise<{ ok: true }> {
    assertCanWrite(user);
    const noteDate = parseDateOnly(date);
    const existing = await this.prisma.dayNote.findUnique({
      where: { userId_noteDate: { userId: user.id, noteDate } },
    });
    if (!existing) throw new NotFoundException('Note not found');
    await this.prisma.dayNote.delete({ where: { id: existing.id } });
    return { ok: true };
  }
}

function assertCanWrite(user: User) {
  if (user.isDemo) {
    throw new ForbiddenException('Demo account is read-only');
  }
}

function parseDateOnly(value: string): Date {
  const match = DATE_RE.exec(value);
  if (!match) throw new BadRequestException('Invalid date (YYYY-MM-DD)');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new BadRequestException('Invalid date (YYYY-MM-DD)');
  }
  return new Date(Date.UTC(year, month - 1, day));
}

function toDto(row: {
  id: number;
  noteDate: Date;
  body: string;
  updatedAt: Date;
}): DayNoteDto {
  return {
    id: row.id,
    noteDate: formatDateOnly(row.noteDate),
    body: row.body,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function formatDateOnly(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
