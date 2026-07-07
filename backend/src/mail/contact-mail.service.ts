import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { escapeHtml } from './escape-html.js';
import { resolveAdminNotifyEmail } from './resolve-admin-notify-email.js';
import { ResendMailService } from './resend-mail.service.js';

export type ContactFormMailPayload = {
  name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

@Injectable()
export class ContactMailService {
  private readonly logger = new Logger(ContactMailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  async sendContactForm(payload: ContactFormMailPayload): Promise<void> {
    if (!this.resend.isConfigured()) {
      throw new ServiceUnavailableException(
        'Hệ thống email chưa được cấu hình. Vui lòng thử lại sau.',
      );
    }

    const to = await resolveAdminNotifyEmail(this.prisma, this.config, 'contact');
    if (!to) {
      throw new ServiceUnavailableException(
        'Không có địa chỉ nhận liên hệ. Vui lòng thử lại sau.',
      );
    }

    const displayName = payload.name?.trim() || 'Khách liên hệ';
    const subject = `[Liên hệ Cội Nguồn] ${payload.subject} — ${displayName}`;
    const phone = payload.phone?.trim() || '—';
    const sentAt = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const html = `
      <h2>Tin nhắn liên hệ mới</h2>
      <p>Người dùng gửi từ form liên hệ trên website.</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Họ và tên</strong></td><td>${escapeHtml(displayName)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(payload.email)}</td></tr>
        <tr><td><strong>Số điện thoại</strong></td><td>${escapeHtml(phone)}</td></tr>
        <tr><td><strong>Chủ đề</strong></td><td>${escapeHtml(payload.subject)}</td></tr>
        <tr><td><strong>Thời gian</strong></td><td>${escapeHtml(sentAt)}</td></tr>
      </table>
      <h3>Lời nhắn</h3>
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    `.trim();

    const text = [
      'Tin nhắn liên hệ mới',
      `Họ và tên: ${displayName}`,
      `Email: ${payload.email}`,
      `Số điện thoại: ${phone}`,
      `Chủ đề: ${payload.subject}`,
      `Thời gian: ${sentAt}`,
      '',
      'Lời nhắn:',
      payload.message,
    ].join('\n');

    const result = await this.resend.send({
      to,
      subject,
      html,
      text,
      replyTo: payload.email,
    });

    if (result.ok) {
      this.logger.log(`Đã gửi tin liên hệ từ ${payload.email} tới ${to}`);
      return;
    }

    this.logger.error(`Gửi tin liên hệ thất bại: ${result.error}`);
    throw new ServiceUnavailableException(
      'Không gửi được tin nhắn. Vui lòng thử lại sau.',
    );
  }
}
