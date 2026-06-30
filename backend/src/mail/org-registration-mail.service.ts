import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { escapeHtml } from './escape-html.js';
import { resolveAdminNotifyEmail } from './resolve-admin-notify-email.js';
import { ResendMailService } from './resend-mail.service.js';

export type OrgRegistrationMailPayload = {
  organizationId: number;
  organizationName: string;
  adminUsername: string;
  adminEmail: string | null;
  registeredAt: Date;
};

@Injectable()
export class OrgRegistrationMailService {
  private readonly logger = new Logger(OrgRegistrationMailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  /** Gửi bất đồng bộ — không chặn API đăng ký nếu email lỗi. */
  notify(payload: OrgRegistrationMailPayload): void {
    void this.send(payload);
  }

  private async send(payload: OrgRegistrationMailPayload): Promise<void> {
    const to = await resolveAdminNotifyEmail(this.prisma, this.config);
    if (!to) {
      this.logger.warn(
        'Không có email nhận thông báo đăng ký dòng họ — cấu hình ORG_REGISTRATION_NOTIFY_EMAIL hoặc email user SYSTEM',
      );
      return;
    }

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ??
      'http://localhost:3000';
    const subject = `[Gia phả] Dòng họ mới: ${payload.organizationName}`;
    const registeredAt = payload.registeredAt.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const adminEmail = payload.adminEmail?.trim() || '—';
    const systemUrl = `${frontendUrl}/system`;

    const html = `
      <h2>Dòng họ mới vừa đăng ký</h2>
      <p>Một người dùng vừa tạo dòng họ trên hệ thống Gia phả.</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Tên dòng họ</strong></td><td>${escapeHtml(payload.organizationName)}</td></tr>
        <tr><td><strong>ID tổ chức</strong></td><td>${payload.organizationId}</td></tr>
        <tr><td><strong>Quản trị viên</strong></td><td>${escapeHtml(payload.adminUsername)}</td></tr>
        <tr><td><strong>Email QTV</strong></td><td>${escapeHtml(adminEmail)}</td></tr>
        <tr><td><strong>Thời gian</strong></td><td>${escapeHtml(registeredAt)}</td></tr>
      </table>
      <p><a href="${escapeHtml(systemUrl)}">Mở trang quản trị hệ thống</a></p>
    `.trim();

    const text = [
      'Dòng họ mới vừa đăng ký',
      `Tên: ${payload.organizationName}`,
      `ID: ${payload.organizationId}`,
      `Quản trị viên: ${payload.adminUsername}`,
      `Email QTV: ${adminEmail}`,
      `Thời gian: ${registeredAt}`,
      `Quản trị: ${systemUrl}`,
    ].join('\n');

    const result = await this.resend.send({ to, subject, html, text });
    if (result.ok) {
      this.logger.log(
        `Đã gửi email thông báo đăng ký dòng họ #${payload.organizationId} tới ${to}`,
      );
      return;
    }
    this.logger.error(
      `Gửi email thông báo đăng ký dòng họ #${payload.organizationId} thất bại: ${result.error}`,
    );
  }
}
