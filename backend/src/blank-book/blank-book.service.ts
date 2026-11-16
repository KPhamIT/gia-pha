import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BlankBookOrderStatus,
  Prisma,
  type BlankBookOrder,
} from '../../generated/prisma/client.js';
import { BlankBookMailService } from '../mail/blank-book-mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { blankBookPrice, readBlankBookPricing } from './blank-book-pricing.js';
import {
  generateBlankBookCode,
  generateSecretToken,
  hashToken,
} from './blank-book-tokens.js';
import type { CreateBlankBookOrderDto } from './dto/create-blank-book-order.dto.js';

/** Số mẫu bìa (COVER_SAMPLES ở frontend) − 1. */
const MAX_COVER_INDEX = 5;

@Injectable()
export class BlankBookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mail: BlankBookMailService,
  ) {}

  getPublicConfig() {
    return {
      ...readBlankBookPricing(this.config),
      payment: this.paymentInfo(),
    };
  }

  async createOrder(body: CreateBlankBookOrderDto) {
    const pricing = readBlankBookPricing(this.config);
    const clanName = cleanClanName(body.clanName);
    const contactEmail = body.contactEmail?.trim() || null;
    const contactPhone = body.contactPhone?.trim() || null;
    if (!clanName) throw new BadRequestException('Vui lòng nhập tên dòng họ');
    if (!contactEmail && !contactPhone) {
      throw new BadRequestException('Vui lòng nhập email hoặc số điện thoại');
    }
    if (
      body.pageCount < pricing.minPages ||
      body.pageCount > pricing.maxPages
    ) {
      throw new BadRequestException(
        `Số trang phải từ ${pricing.minPages} đến ${pricing.maxPages}`,
      );
    }

    const confirmToken = generateSecretToken();
    const order = await this.insertWithUniqueCode({
      accessToken: generateSecretToken(),
      confirmTokenHash: hashToken(confirmToken),
      clanName,
      establishedYear: body.establishedYear?.trim() || null,
      clanAddress: body.clanAddress?.trim() || null,
      pageCount: body.pageCount,
      coverIndex: Math.min(MAX_COVER_INDEX, Math.max(0, body.coverIndex ?? 0)),
      amountVnd: blankBookPrice(pricing, body.pageCount),
      contactEmail,
      contactPhone,
    });
    this.mail.notifyCreated(order, confirmToken);
    return this.publicView(order);
  }

  async getByAccessToken(accessToken: string) {
    const order = await this.prisma.blankBookOrder.findUnique({
      where: { accessToken },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return this.publicView(order);
  }

  /** Xem đơn cho trang xác nhận — không đổi trạng thái (an toàn với trình quét link trong mail). */
  async getForConfirm(token: string) {
    return this.adminView(await this.findByConfirmToken(token));
  }

  /** Xác nhận đã nhận tiền: token dùng 1 lần (xoá hash ngay trong cùng câu lệnh cập nhật). */
  async confirm(token: string) {
    const order = await this.findByConfirmToken(token);
    const updated = await this.prisma.blankBookOrder.updateMany({
      where: {
        id: order.id,
        confirmTokenHash: hashToken(token),
        status: BlankBookOrderStatus.PENDING,
      },
      data: {
        status: BlankBookOrderStatus.PAID,
        paidAt: new Date(),
        confirmTokenHash: null,
      },
    });
    if (updated.count !== 1) throw new ConflictException('Đơn đã được xử lý');
    const paid = await this.prisma.blankBookOrder.findUniqueOrThrow({
      where: { id: order.id },
    });
    this.mail.notifyPaid(paid);
    return this.adminView(paid);
  }

  private async findByConfirmToken(token: string): Promise<BlankBookOrder> {
    const order = token
      ? await this.prisma.blankBookOrder.findUnique({
          where: { confirmTokenHash: hashToken(token) },
        })
      : null;
    if (!order || order.status !== BlankBookOrderStatus.PENDING) {
      throw new NotFoundException(
        'Link xác nhận không hợp lệ hoặc đã được dùng',
      );
    }
    return order;
  }

  private async insertWithUniqueCode(
    data: Omit<Prisma.BlankBookOrderCreateInput, 'code'>,
  ): Promise<BlankBookOrder> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        return await this.prisma.blankBookOrder.create({
          data: { ...data, code: generateBlankBookCode() },
        });
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          continue;
        }
        throw err;
      }
    }
    throw new ConflictException('Không tạo được mã đơn, vui lòng thử lại');
  }

  private paymentInfo() {
    return {
      qrImageUrl: this.config.get<string>(
        'PAYMENT_QR_URL',
        '/images/payment-qr.webp',
      ),
      accountName: this.config.get<string>('PAYMENT_ACCOUNT_NAME', ''),
      accountNumber: this.config.get<string>('PAYMENT_ACCOUNT_NUMBER', ''),
      bankName: this.config.get<string>('PAYMENT_BANK_NAME', ''),
    };
  }

  private publicView(order: BlankBookOrder) {
    return {
      code: order.code,
      accessToken: order.accessToken,
      status: order.status,
      clanName: order.clanName,
      establishedYear: order.establishedYear,
      clanAddress: order.clanAddress,
      pageCount: order.pageCount,
      coverIndex: order.coverIndex,
      amountVnd: order.amountVnd,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      payment:
        order.status === BlankBookOrderStatus.PENDING
          ? this.paymentInfo()
          : null,
    };
  }

  private adminView(order: BlankBookOrder) {
    return {
      code: order.code,
      status: order.status,
      clanName: order.clanName,
      pageCount: order.pageCount,
      amountVnd: order.amountVnd,
      contactEmail: order.contactEmail,
      contactPhone: order.contactPhone,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    };
  }
}

/** Bỏ chữ "Họ" / "Dòng họ" ở đầu (giống công cụ in sách). */
function cleanClanName(value: string): string {
  return value
    .trim()
    .replace(/^(dòng\s+)?họ\s+/iu, '')
    .trim();
}
