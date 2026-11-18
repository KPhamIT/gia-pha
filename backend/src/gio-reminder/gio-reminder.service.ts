import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import type { GioReminder } from '../../generated/prisma/client.js';
import { GioReminderMailService } from '../mail/gio-reminder-mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateGioReminderDto } from './dto/create-gio-reminder.dto.js';
import {
  REMIND_DAYS_BEFORE,
  daysUntilGio,
  nextGioSolarLabel,
  todayKeyVn,
} from './gio-reminder-dates.js';

/** Một email không đăng ký quá nhiều ngày giỗ (chống spam vào hộp thư người khác). */
const MAX_PER_EMAIL = 20;

@Injectable()
export class GioReminderService {
  private readonly logger = new Logger(GioReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: GioReminderMailService,
  ) {}

  async create(body: CreateGioReminderDto) {
    const email = body.email.trim().toLowerCase();
    const deceasedName = body.deceasedName.trim();
    if (!deceasedName)
      throw new BadRequestException('Vui lòng nhập tên người được nhắc giỗ');
    const next = nextGioSolarLabel(body.lunarMonth, body.lunarDay);
    if (!next) throw new BadRequestException('Ngày âm lịch không hợp lệ');

    const count = await this.prisma.gioReminder.count({
      where: { email, active: true },
    });
    if (count >= MAX_PER_EMAIL) {
      throw new BadRequestException('Email này đã đăng ký quá nhiều ngày giỗ');
    }

    const reminder = await this.prisma.gioReminder.create({
      data: {
        deceasedName,
        lunarMonth: body.lunarMonth,
        lunarDay: body.lunarDay,
        email,
        manageToken: randomBytes(24).toString('base64url'),
      },
    });
    this.mail.notifySubscribed(reminder, next);
    return { ok: true as const, nextDate: next.label, daysUntil: next.days };
  }

  async getByToken(token: string) {
    const reminder = await this.prisma.gioReminder.findUnique({
      where: { manageToken: token },
    });
    if (!reminder)
      throw new NotFoundException('Không tìm thấy đăng ký nhắc giỗ');
    return {
      deceasedName: reminder.deceasedName,
      lunarMonth: reminder.lunarMonth,
      lunarDay: reminder.lunarDay,
      active: reminder.active,
    };
  }

  async unsubscribe(token: string) {
    const updated = await this.prisma.gioReminder.updateMany({
      where: { manageToken: token },
      data: { active: false },
    });
    if (updated.count !== 1)
      throw new NotFoundException('Không tìm thấy đăng ký nhắc giỗ');
    return { ok: true as const };
  }

  /** Chạy hằng ngày: gửi email cho các ngày giỗ còn 3 ngày hoặc đúng hôm nay. */
  async runDailyCron(referenceDate = new Date()) {
    const today = todayKeyVn(referenceDate);
    const reminders = await this.prisma.gioReminder.findMany({
      where: { active: true },
    });
    let sent = 0;
    for (const reminder of reminders) {
      const days = daysUntilGio(
        reminder.lunarMonth,
        reminder.lunarDay,
        referenceDate,
      );
      if (
        days == null ||
        !(REMIND_DAYS_BEFORE as readonly number[]).includes(days)
      )
        continue;
      const key = `${today}:${days}`;
      if (reminder.lastSentKey === key) continue;
      const claimed = await this.claim(reminder, key);
      if (!claimed) continue;
      const next = nextGioSolarLabel(
        reminder.lunarMonth,
        reminder.lunarDay,
        referenceDate,
      );
      if (next && (await this.mail.sendReminder(reminder, next))) sent += 1;
    }
    this.logger.log(
      `Gio reminder cron: checked=${reminders.length}, sent=${sent}`,
    );
    return { checked: reminders.length, sent };
  }

  /** Đánh dấu trước khi gửi để hai lần chạy song song không gửi trùng. */
  private async claim(reminder: GioReminder, key: string): Promise<boolean> {
    const res = await this.prisma.gioReminder.updateMany({
      where: { id: reminder.id, lastSentKey: reminder.lastSentKey },
      data: { lastSentKey: key },
    });
    return res.count === 1;
  }
}
