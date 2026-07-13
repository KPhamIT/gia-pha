import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { escapeHtml } from './escape-html.js';
import { formatVnd } from './format-vnd.js';
import { resolveAdminNotifyEmail } from './resolve-admin-notify-email.js';
import { ResendMailService } from './resend-mail.service.js';

export type AppFundMailPayload = {
  id: number;
  organizationId: number;
  organizationName: string;
  donorName: string;
  amount: number;
  transferCode: string | null;
  note: string | null;
  donorEmail: string | null;
};

@Injectable()
export class AppFundMailService {
  private readonly logger = new Logger(AppFundMailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  notifySubmitted(payload: AppFundMailPayload): void {
    void this.sendSubmitted(payload);
  }

  notifyConfirmed(payload: AppFundMailPayload): void {
    void this.sendConfirmed(payload);
  }

  notifyRejected(payload: AppFundMailPayload, reviewNote: string): void {
    void this.sendRejected(payload, reviewNote);
  }

  private async sendSubmitted(payload: AppFundMailPayload): Promise<void> {
    const amount = formatVnd(payload.amount);
    const frontendUrl = this.frontendUrl();
    const billingUrl = `${frontendUrl}/system/billing`;
    const code = payload.transferCode ?? '—';

    await this.sendToAdmin({
      subject: `[Gia phả] Quyên góp phí app chờ duyệt: ${payload.organizationName}`,
      html: `
        <h2>Quyên góp phí app mới</h2>
        <p>Thành viên đã báo đã chuyển khoản — cần đối chiếu và xác nhận.</p>
        ${fundTableHtml(payload, amount)}
        <p><a href="${escapeHtml(billingUrl)}">Mở trang duyệt thanh toán / quỹ app</a></p>
      `.trim(),
      text: [
        'Quyên góp phí app mới — chờ duyệt',
        `Dòng họ: ${payload.organizationName}`,
        `Người quyên góp: ${payload.donorName}`,
        `Mã: ${code}`,
        `Số tiền: ${amount}`,
        `Duyệt: ${billingUrl}`,
      ].join('\n'),
    });

    await this.sendToDonor(payload, {
      subject: `[Gia phả] Đã nhận yêu cầu quyên góp — ${payload.organizationName}`,
      html: `
        <h2>Chúng tôi đã nhận yêu cầu quyên góp</h2>
        <p>Cảm ơn <strong>${escapeHtml(payload.donorName)}</strong>. Khoản quyên góp phí app cho dòng họ <strong>${escapeHtml(payload.organizationName)}</strong> đang chờ xác nhận.</p>
        ${fundTableHtml(payload, amount)}
        <p>Vui lòng ghi mã chuyển khoản vào nội dung giao dịch. Trong giờ hành chính, thường xác nhận trong vòng 24 giờ sau khi chuyển khoản thành công.</p>
      `.trim(),
      text: [
        'Chúng tôi đã nhận yêu cầu quyên góp của bạn.',
        `Dòng họ: ${payload.organizationName}`,
        `Người quyên góp: ${payload.donorName}`,
        `Mã: ${code}`,
        `Số tiền: ${amount}`,
        'Trạng thái: Chờ xác nhận',
      ].join('\n'),
    });
  }

  private async sendConfirmed(payload: AppFundMailPayload): Promise<void> {
    const amount = formatVnd(payload.amount);
    await this.sendToDonor(payload, {
      subject: `[Gia phả] Đã xác nhận quyên góp — ${payload.organizationName}`,
      html: `
        <h2>Quyên góp đã được xác nhận</h2>
        <p>Cảm ơn <strong>${escapeHtml(payload.donorName)}</strong>. Khoản quyên góp phí app cho dòng họ <strong>${escapeHtml(payload.organizationName)}</strong> đã được ghi nhận vào quỹ.</p>
        ${fundTableHtml(payload, amount)}
      `.trim(),
      text: [
        'Quyên góp đã được xác nhận.',
        `Dòng họ: ${payload.organizationName}`,
        `Số tiền: ${amount}`,
        `Mã: ${payload.transferCode ?? '—'}`,
      ].join('\n'),
    });
  }

  private async sendRejected(
    payload: AppFundMailPayload,
    reviewNote: string,
  ): Promise<void> {
    const amount = formatVnd(payload.amount);
    await this.sendToDonor(payload, {
      subject: `[Gia phả] Không xác nhận được quyên góp — ${payload.organizationName}`,
      html: `
        <h2>Quyên góp chưa được xác nhận</h2>
        <p>Rất tiếc, chúng tôi chưa xác nhận được khoản chuyển của <strong>${escapeHtml(payload.donorName)}</strong> cho dòng họ <strong>${escapeHtml(payload.organizationName)}</strong>.</p>
        ${fundTableHtml(payload, amount)}
        <p><strong>Lý do:</strong> ${escapeHtml(reviewNote)}</p>
        <p>Vui lòng kiểm tra lại số tiền và nội dung chuyển khoản, sau đó gửi lại yêu cầu nếu cần.</p>
      `.trim(),
      text: [
        'Quyên góp chưa được xác nhận.',
        `Dòng họ: ${payload.organizationName}`,
        `Mã: ${payload.transferCode ?? '—'}`,
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
        'Không có email nhận thông báo quỹ app — cấu hình BILLING_NOTIFY_EMAIL hoặc email user SYSTEM',
      );
      return;
    }
    await this.deliver(to, content, 'admin');
  }

  private async sendToDonor(
    payload: AppFundMailPayload,
    content: { subject: string; html: string; text: string },
  ): Promise<void> {
    const to = payload.donorEmail?.trim() || null;
    if (!to) {
      this.logger.warn(
        `Không gửi email người quyên góp #${payload.id} — thiếu email`,
      );
      return;
    }
    await this.deliver(to, content, `donor #${payload.id}`);
  }

  private async deliver(
    to: string,
    content: { subject: string; html: string; text: string },
    label: string,
  ): Promise<void> {
    const result = await this.resend.send({ to, ...content });
    if (result.ok) {
      this.logger.log(`Đã gửi email quỹ app (${label}) tới ${to}`);
      return;
    }
    this.logger.error(`Gửi email quỹ app (${label}) thất bại: ${result.error}`);
  }

  private frontendUrl(): string {
    return (
      this.config.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  }
}

function fundTableHtml(payload: AppFundMailPayload, amount: string): string {
  const code = payload.transferCode ?? '—';
  return `
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><strong>Dòng họ</strong></td><td>${escapeHtml(payload.organizationName)}</td></tr>
      <tr><td><strong>Người quyên góp</strong></td><td>${escapeHtml(payload.donorName)}</td></tr>
      <tr><td><strong>Mã chuyển khoản</strong></td><td>${escapeHtml(code)}</td></tr>
      <tr><td><strong>Số tiền</strong></td><td>${escapeHtml(amount)}</td></tr>
      ${payload.note ? `<tr><td><strong>Ghi chú</strong></td><td>${escapeHtml(payload.note)}</td></tr>` : ''}
      ${payload.donorEmail ? `<tr><td><strong>Email</strong></td><td>${escapeHtml(payload.donorEmail)}</td></tr>` : ''}
    </table>
  `.trim();
}
