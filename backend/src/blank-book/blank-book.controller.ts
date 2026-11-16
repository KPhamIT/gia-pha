import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { BlankBookService } from './blank-book.service.js';
import { CreateBlankBookOrderDto } from './dto/create-blank-book-order.dto.js';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_ORDERS = 5;

/**
 * Dịch vụ công khai: mua file sổ gia phả trống (không cần đăng nhập).
 * Quyền truy cập dựa trên token bí mật trong URL: `accessToken` (khách) và
 * token xác nhận (chỉ gửi qua email chủ web, lưu dạng SHA-256, dùng 1 lần).
 */
@Controller('blank-book')
export class BlankBookController {
  private readonly recentOrders = new Map<string, number[]>();

  constructor(private readonly service: BlankBookService) {}

  @Get('config')
  getConfig() {
    return this.service.getPublicConfig();
  }

  @Post('orders')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  create(@Body() body: CreateBlankBookOrderDto, @Req() req: Request) {
    this.enforceRateLimit(clientIp(req));
    return this.service.createOrder(body);
  }

  @Get('orders/:accessToken')
  getOrder(@Param('accessToken') accessToken: string) {
    return this.service.getByAccessToken(accessToken);
  }

  @Get('confirm/:token')
  getForConfirm(@Param('token') token: string) {
    return this.service.getForConfirm(token);
  }

  @Post('confirm/:token')
  confirm(@Param('token') token: string) {
    return this.service.confirm(token);
  }

  /** Chặn spam đơn (mỗi đơn gửi 1 email cho chủ web). */
  private enforceRateLimit(ip: string) {
    const now = Date.now();
    const recent = (this.recentOrders.get(ip) ?? []).filter(
      (t) => now - t < RATE_WINDOW_MS,
    );
    if (recent.length >= RATE_MAX_ORDERS) {
      throw new HttpException(
        'Bạn đặt quá nhiều đơn, vui lòng thử lại sau ít phút',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    if (this.recentOrders.size > 5000) this.recentOrders.clear();
    this.recentOrders.set(ip, recent);
  }
}

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
    ?.split(',')[0]
    ?.trim();
  return first || req.ip || 'unknown';
}
