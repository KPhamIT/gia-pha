import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BlankBookOrder } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { escapeHtml } from './escape-html.js';
import { formatVnd } from './format-vnd.js';
import { resolveAdminNotifyEmail } from './resolve-admin-notify-email.js';
import { ResendMailService } from './resend-mail.service.js';

type Mail = { subject: string; html: string; text: string };

const BUTTON_STYLE =
  'background:#944a00;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600';

/** Email dịch vụ sổ gia phả trống: báo chủ web (kèm link xác nhận 1 chạm) và gửi link tải cho khách. */
@Injectable()
export class BlankBookMailService {
  private readonly logger = new Logger(BlankBookMailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  notifyCreated(order: BlankBookOrder, confirmToken: string): void {
    void this.sendCreated(order, confirmToken);
  }

  notifyPaid(order: BlankBookOrder): void {
    void this.sendPaid(order);
  }

  private async sendCreated(order: BlankBookOrder, confirmToken: string) {
    const confirmUrl = `${this.frontendUrl()}/sach-gia-pha-trong/xac-nhan/${confirmToken}`;
    const amount = formatVnd(order.amountVnd);
    const to = await resolveAdminNotifyEmail(
      this.prisma,
      this.config,
      'billing',
    );
    if (!to) {
      this.logger.warn(
        'Không có email nhận thông báo — cấu hình BILLING_NOTIFY_EMAIL hoặc ORG_REGISTRATION_NOTIFY_EMAIL',
      );
    } else {
      await this.deliver(to, `admin ${order.code}`, {
        subject: `[Sổ gia phả trống] Đơn mới ${order.code} — ${amount}`,
        html: `
          <h2>Đơn sổ gia phả trống mới</h2>
          <p>Kiểm tra tài khoản đã nhận <strong>${escapeHtml(amount)}</strong> với nội dung <strong>${escapeHtml(order.code)}</strong>, rồi bấm nút dưới đây.</p>
          ${orderTable(order)}
          <p style="margin:24px 0"><a href="${escapeHtml(confirmUrl)}" style="${BUTTON_STYLE}">Xác nhận đã nhận tiền</a></p>
          <p style="color:#666;font-size:13px">Link mở trang xác nhận; trạng thái chỉ đổi khi bạn bấm nút trên trang đó. Link dùng được một lần.</p>
        `.trim(),
        text: [
          `Đơn sổ gia phả trống mới: ${order.code}`,
          ...orderLines(order),
          `Xác nhận đã nhận tiền: ${confirmUrl}`,
        ].join('\n'),
      });
    }

    if (!order.contactEmail) return;
    const orderUrl = this.orderUrl(order);
    await this.deliver(order.contactEmail, `customer ${order.code}`, {
      subject: `[Gia phả] Đơn ${order.code} — sổ gia phả trống họ ${order.clanName}`,
      html: `
        <h2>Cảm ơn bạn đã đặt sổ gia phả trống</h2>
        <p>Vui lòng chuyển khoản <strong>${escapeHtml(amount)}</strong> với nội dung <strong>${escapeHtml(order.code)}</strong>. Sau khi chúng tôi xác nhận, bạn tải file ngay tại trang đơn hàng.</p>
        ${orderTable(order)}
        <p style="margin:24px 0"><a href="${escapeHtml(orderUrl)}" style="${BUTTON_STYLE}">Mở trang đơn hàng</a></p>
      `.trim(),
      text: [
        `Đơn ${order.code}`,
        ...orderLines(order),
        `Trang đơn hàng: ${orderUrl}`,
      ].join('\n'),
    });
  }

  private async sendPaid(order: BlankBookOrder) {
    if (!order.contactEmail) return;
    const orderUrl = this.orderUrl(order);
    await this.deliver(order.contactEmail, `customer paid ${order.code}`, {
      subject: `[Gia phả] Sổ gia phả trống họ ${order.clanName} đã sẵn sàng tải`,
      html: `
        <h2>Đã xác nhận thanh toán</h2>
        <p>Sổ gia phả trống họ <strong>${escapeHtml(order.clanName)}</strong> (${order.pageCount} trang) đã sẵn sàng.</p>
        <p style="margin:24px 0"><a href="${escapeHtml(orderUrl)}" style="${BUTTON_STYLE}">Tải file sổ gia phả</a></p>
        <p style="color:#666;font-size:13px">Giữ email này để tải lại bất cứ lúc nào.</p>
      `.trim(),
      text: [`Đã xác nhận đơn ${order.code}.`, `Tải file: ${orderUrl}`].join(
        '\n',
      ),
    });
  }

  private async deliver(to: string, label: string, mail: Mail) {
    const result = await this.resend.send({ to, ...mail });
    if (result.ok)
      this.logger.log(`Đã gửi email sổ trống (${label}) tới ${to}`);
    else
      this.logger.error(
        `Gửi email sổ trống (${label}) thất bại: ${result.error}`,
      );
  }

  private orderUrl(order: BlankBookOrder): string {
    return `${this.frontendUrl()}/sach-gia-pha-trong/don/${order.accessToken}`;
  }

  private frontendUrl(): string {
    return (
      this.config.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  }
}

function orderLines(order: BlankBookOrder): string[] {
  return [
    `Mã đơn: ${order.code}`,
    `Dòng họ: ${order.clanName}`,
    `Số trang: ${order.pageCount}`,
    `Số tiền: ${formatVnd(order.amountVnd)}`,
    `Liên hệ: ${[order.contactEmail, order.contactPhone].filter(Boolean).join(' · ')}`,
  ];
}

function orderTable(order: BlankBookOrder): string {
  const rows: [string, string][] = [
    ['Mã đơn (nội dung CK)', order.code],
    ['Dòng họ', order.clanName],
    ['Số trang', String(order.pageCount)],
    ['Số tiền', formatVnd(order.amountVnd)],
    [
      'Liên hệ',
      [order.contactEmail, order.contactPhone].filter(Boolean).join(' · '),
    ],
  ];
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
    )
    .join('');
  return `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">${body}</table>`;
}
