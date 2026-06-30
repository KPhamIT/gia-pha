import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../generated/prisma/client.js';
import { TIER_CATALOG } from '../billing/billing-tier.js';
import type { SubscriptionTier } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { escapeHtml } from './escape-html.js';
import { formatVnd } from './format-vnd.js';
import { resolveAdminNotifyEmail } from './resolve-admin-notify-email.js';
import { ResendMailService } from './resend-mail.service.js';

export type BillingOrderMailPayload = {
  id: number;
  organizationId: number;
  organizationName: string;
  transferCode: string;
  tier: SubscriptionTier;
  amountVnd: number;
  personCountAtOrder: number;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  note: string | null;
};

@Injectable()
export class BillingMailService {
  private readonly logger = new Logger(BillingMailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  notifySubmitted(payload: BillingOrderMailPayload): void {
    void this.sendSubmitted(payload);
  }

  notifyConfirmed(
    payload: BillingOrderMailPayload,
    subscriptionExpiresAt: Date,
  ): void {
    void this.sendConfirmed(payload, subscriptionExpiresAt);
  }

  notifyRejected(payload: BillingOrderMailPayload, reviewNote: string): void {
    void this.sendRejected(payload, reviewNote);
  }

  private async sendSubmitted(payload: BillingOrderMailPayload): Promise<void> {
    const tierLabel = TIER_CATALOG[payload.tier].label;
    const amount = formatVnd(payload.amountVnd);
    const frontendUrl = this.frontendUrl();
    const billingUrl = `${frontendUrl}/system/billing`;

    await this.sendToAdmin({
      subject: `[Gia phả] Thanh toán chờ duyệt: ${payload.organizationName}`,
      html: `
        <h2>Đơn thanh toán mới</h2>
        <p>Khách hàng đã báo đã chuyển khoản — cần duyệt và kích hoạt gói.</p>
        ${orderTableHtml(payload, tierLabel, amount)}
        <p><a href="${escapeHtml(billingUrl)}">Mở trang duyệt thanh toán</a></p>
      `.trim(),
      text: submittedAdminText(payload, tierLabel, amount, billingUrl),
    });

    await this.sendToCustomer(payload, {
      subject: `[Gia phả] Đã nhận yêu cầu thanh toán — ${payload.organizationName}`,
      html: `
        <h2>Chúng tôi đã nhận yêu cầu thanh toán</h2>
        <p>Cảm ơn bạn. Yêu cầu kích hoạt gói cho dòng họ <strong>${escapeHtml(payload.organizationName)}</strong> đang được xử lý.</p>
        ${orderTableHtml(payload, tierLabel, amount)}
        <p>Trong giờ hành chính, thường xác nhận trong vòng 24 giờ sau khi chuyển khoản thành công.</p>
        <p><a href="${escapeHtml(`${frontendUrl}/bang-gia/thanh-toan?orgId=${payload.organizationId}`)}">Xem trạng thái thanh toán</a></p>
      `.trim(),
      text: [
        'Chúng tôi đã nhận yêu cầu thanh toán của bạn.',
        `Dòng họ: ${payload.organizationName}`,
        `Mã đơn: ${payload.transferCode}`,
        `Gói: ${tierLabel}`,
        `Số tiền: ${amount}`,
        'Trạng thái: Chờ xác nhận',
      ].join('\n'),
    });
  }

  private async sendConfirmed(
    payload: BillingOrderMailPayload,
    subscriptionExpiresAt: Date,
  ): Promise<void> {
    const tierLabel = TIER_CATALOG[payload.tier].label;
    const amount = formatVnd(payload.amountVnd);
    const expiresLabel = subscriptionExpiresAt.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const frontendUrl = this.frontendUrl();

    await this.sendToCustomer(payload, {
      subject: `[Gia phả] Gói đã được kích hoạt — ${payload.organizationName}`,
      html: `
        <h2>Gói dịch vụ đã kích hoạt</h2>
        <p>Gói <strong>${escapeHtml(tierLabel)}</strong> cho dòng họ <strong>${escapeHtml(payload.organizationName)}</strong> đã có hiệu lực.</p>
        ${orderTableHtml(payload, tierLabel, amount)}
        <p><strong>Có hiệu lực đến:</strong> ${escapeHtml(expiresLabel)}</p>
        <p>Bạn có thể tải file export (từ 30 thành viên trở lên) khi gói còn hạn.</p>
        <p><a href="${escapeHtml(`${frontendUrl}/family-tree`)}">Mở gia phả</a></p>
      `.trim(),
      text: [
        'Gói dịch vụ đã được kích hoạt.',
        `Dòng họ: ${payload.organizationName}`,
        `Gói: ${tierLabel}`,
        `Có hiệu lực đến: ${expiresLabel}`,
        `Mã đơn: ${payload.transferCode}`,
      ].join('\n'),
    });
  }

  private async sendRejected(
    payload: BillingOrderMailPayload,
    reviewNote: string,
  ): Promise<void> {
    const tierLabel = TIER_CATALOG[payload.tier].label;
    const amount = formatVnd(payload.amountVnd);
    const frontendUrl = this.frontendUrl();

    await this.sendToCustomer(payload, {
      subject: `[Gia phả] Không xác nhận được thanh toán — ${payload.organizationName}`,
      html: `
        <h2>Thanh toán chưa được xác nhận</h2>
        <p>Rất tiếc, chúng tôi chưa xác nhận được khoản chuyển cho dòng họ <strong>${escapeHtml(payload.organizationName)}</strong>.</p>
        ${orderTableHtml(payload, tierLabel, amount)}
        <p><strong>Lý do:</strong> ${escapeHtml(reviewNote)}</p>
        <p>Vui lòng kiểm tra lại số tiền và thông tin chuyển khoản, sau đó gửi lại yêu cầu hoặc liên hệ hỗ trợ.</p>
        <p><a href="${escapeHtml(`${frontendUrl}/bang-gia/thanh-toan?orgId=${payload.organizationId}`)}">Thử lại thanh toán</a></p>
      `.trim(),
      text: [
        'Thanh toán chưa được xác nhận.',
        `Dòng họ: ${payload.organizationName}`,
        `Mã đơn: ${payload.transferCode}`,
        `Lý do: ${reviewNote}`,
      ].join('\n'),
    });
  }

  private async sendToAdmin(content: {
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    const to = await resolveAdminNotifyEmail(this.prisma, this.config, 'billing');
    if (!to) {
      this.logger.warn(
        'Không có email nhận thông báo billing — cấu hình BILLING_NOTIFY_EMAIL hoặc ORG_REGISTRATION_NOTIFY_EMAIL',
      );
      return;
    }
    await this.deliver(to, content, 'admin');
  }

  private async sendToCustomer(
    payload: BillingOrderMailPayload,
    content: { subject: string; html: string; text: string },
  ): Promise<void> {
    const to = await this.resolveCustomerEmail(payload);
    if (!to) {
      this.logger.warn(
        `Không gửi email khách cho đơn #${payload.id} — thiếu contactEmail và email admin org`,
      );
      return;
    }
    await this.deliver(to, content, `customer order #${payload.id}`);
  }

  private async deliver(
    to: string,
    content: { subject: string; html: string; text: string },
    label: string,
  ): Promise<void> {
    const result = await this.resend.send({ to, ...content });
    if (result.ok) {
      this.logger.log(`Đã gửi email billing (${label}) tới ${to}`);
      return;
    }
    this.logger.error(`Gửi email billing (${label}) thất bại: ${result.error}`);
  }

  private async resolveCustomerEmail(
    payload: BillingOrderMailPayload,
  ): Promise<string | null> {
    const fromContact = payload.contactEmail?.trim();
    if (fromContact) return fromContact;

    const admin = await this.prisma.user.findFirst({
      where: {
        organizationId: payload.organizationId,
        role: UserRole.ADMIN,
        isActive: true,
        email: { not: null },
      },
      orderBy: { id: 'asc' },
      select: { email: true },
    });
    return admin?.email?.trim() || null;
  }

  private frontendUrl(): string {
    return (
      this.config.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  }
}

function orderTableHtml(
  payload: BillingOrderMailPayload,
  tierLabel: string,
  amount: string,
): string {
  const contact = [payload.contactName, payload.contactPhone, payload.contactEmail]
    .filter(Boolean)
    .join(' · ');
  return `
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><strong>Dòng họ</strong></td><td>${escapeHtml(payload.organizationName)}</td></tr>
      <tr><td><strong>Mã đơn</strong></td><td>${escapeHtml(payload.transferCode)}</td></tr>
      <tr><td><strong>Gói</strong></td><td>${escapeHtml(tierLabel)}</td></tr>
      <tr><td><strong>Số tiền</strong></td><td>${escapeHtml(amount)}</td></tr>
      <tr><td><strong>Số thành viên</strong></td><td>${payload.personCountAtOrder}</td></tr>
      ${contact ? `<tr><td><strong>Liên hệ</strong></td><td>${escapeHtml(contact)}</td></tr>` : ''}
      ${payload.note ? `<tr><td><strong>Ghi chú</strong></td><td>${escapeHtml(payload.note)}</td></tr>` : ''}
    </table>
  `.trim();
}

function submittedAdminText(
  payload: BillingOrderMailPayload,
  tierLabel: string,
  amount: string,
  billingUrl: string,
): string {
  return [
    'Đơn thanh toán mới — chờ duyệt',
    `Dòng họ: ${payload.organizationName}`,
    `Mã: ${payload.transferCode}`,
    `Gói: ${tierLabel}`,
    `Số tiền: ${amount}`,
    `Duyệt: ${billingUrl}`,
  ].join('\n');
}
