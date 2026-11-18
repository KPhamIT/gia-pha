import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GioReminder } from '../../generated/prisma/client.js';
import { formatLunarDeathDate } from '../notifications/utils/lunar-death-anniversary.js';
import { escapeHtml } from './escape-html.js';
import { ResendMailService } from './resend-mail.service.js';

type NextGio = { days: number; label: string };

const BUTTON =
  'background:#944a00;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block';

/** Email nhắc ngày giỗ cho khách vãng lai: xác nhận đăng ký + nhắc trước 3 ngày / đúng ngày. */
@Injectable()
export class GioReminderMailService {
  private readonly logger = new Logger(GioReminderMailService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  notifySubscribed(reminder: GioReminder, next: NextGio): void {
    void this.send(reminder, {
      subject: `Đã bật nhắc ngày giỗ ${reminder.deceasedName}`,
      heading: 'Đã bật nhắc ngày giỗ',
      intro: `Cội Nguồn sẽ gửi email nhắc trước 3 ngày và đúng ngày giỗ <strong>${escapeHtml(reminder.deceasedName)}</strong> (${formatLunarDeathDate(reminder.lunarMonth, reminder.lunarDay)}) hằng năm.`,
      next,
    });
  }

  async sendReminder(reminder: GioReminder, next: NextGio): Promise<boolean> {
    const when = next.days === 0 ? 'Hôm nay' : `Còn ${next.days} ngày nữa`;
    return this.send(reminder, {
      subject: `${when} là ngày giỗ ${reminder.deceasedName}`,
      heading: `${when} là ngày giỗ ${escapeHtml(reminder.deceasedName)}`,
      intro: `Ngày giỗ ${formatLunarDeathDate(reminder.lunarMonth, reminder.lunarDay)} rơi vào <strong>${escapeHtml(next.label)}</strong>. Xem bài văn khấn ngày giỗ để chuẩn bị chu đáo.`,
      next,
      extraLink: {
        href: `${this.frontendUrl()}/van-khan`,
        label: 'Xem bài văn khấn',
      },
    });
  }

  private async send(
    reminder: GioReminder,
    content: {
      subject: string;
      heading: string;
      intro: string;
      next: NextGio;
      extraLink?: { href: string; label: string };
    },
  ): Promise<boolean> {
    const base = this.frontendUrl();
    const manageUrl = `${base}/nhac-ngay-gio/quan-ly/${reminder.manageToken}`;
    const signupUrl = `${base}/tao-dong-ho`;
    const extra = content.extraLink
      ? `<p><a href="${escapeHtml(content.extraLink.href)}">${escapeHtml(content.extraLink.label)}</a></p>`
      : '';
    const html = `
      <h2>${content.heading}</h2>
      <p>${content.intro}</p>
      <p><strong>Lần giỗ tới:</strong> ${escapeHtml(content.next.label)}</p>
      ${extra}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p><strong>Lưu ngày giỗ của cả gia đình ở một nơi</strong><br>
      Lập cây gia phả miễn phí: ghi ông bà, bố mẹ, con cháu; tự nhắc mọi ngày giỗ; gửi link cho họ hàng cùng xem.</p>
      <p style="margin:20px 0"><a href="${escapeHtml(signupUrl)}" style="${BUTTON}">Lập gia phả miễn phí</a></p>
      <p style="color:#888;font-size:12px">Không muốn nhận nữa? <a href="${escapeHtml(manageUrl)}">Tắt nhắc ngày giỗ này</a>.</p>
    `.trim();
    const text = [
      content.subject,
      `Lần giỗ tới: ${content.next.label}`,
      `Lập gia phả miễn phí: ${signupUrl}`,
      `Tắt nhắc: ${manageUrl}`,
    ].join('\n');

    const result = await this.resend.send({
      to: reminder.email,
      subject: content.subject,
      html,
      text,
    });
    if (!result.ok)
      this.logger.error(
        `Gửi nhắc giỗ #${reminder.id} thất bại: ${result.error}`,
      );
    return result.ok;
  }

  private frontendUrl(): string {
    return (
      this.config.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ??
      'http://localhost:3000'
    );
  }
}
