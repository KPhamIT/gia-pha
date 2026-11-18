import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { CronGuard } from '../auth/cron.guard.js';
import { CreateGioReminderDto } from './dto/create-gio-reminder.dto.js';
import { GioReminderService } from './gio-reminder.service.js';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 10;

/** Nhắc ngày giỗ qua email cho khách chưa có tài khoản (công khai, quản lý bằng token). */
@Controller('gio-reminders')
export class GioReminderController {
  private readonly recent = new Map<string, number[]>();

  constructor(private readonly service: GioReminderService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  create(@Body() body: CreateGioReminderDto, @Req() req: Request) {
    this.enforceRateLimit(clientIp(req));
    return this.service.create(body);
  }

  @Get('manage/:token')
  get(@Param('token') token: string) {
    return this.service.getByToken(token);
  }

  /** POST (không phải GET) để trình quét link trong email không tự huỷ. */
  @Post('manage/:token/unsubscribe')
  unsubscribe(@Param('token') token: string) {
    return this.service.unsubscribe(token);
  }

  /** Gọi hằng ngày từ GitHub Actions (cùng lịch với cron nhắc giỗ thành viên). */
  @Post('cron')
  @UseGuards(CronGuard)
  cron() {
    return this.service.runDailyCron();
  }

  private enforceRateLimit(ip: string) {
    const now = Date.now();
    const list = (this.recent.get(ip) ?? []).filter(
      (t) => now - t < RATE_WINDOW_MS,
    );
    if (list.length >= RATE_MAX) {
      throw new HttpException(
        'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    list.push(now);
    if (this.recent.size > 5000) this.recent.clear();
    this.recent.set(ip, list);
  }
}

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
    ?.split(',')[0]
    ?.trim();
  return first || req.ip || 'unknown';
}
