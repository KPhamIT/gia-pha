import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { escapeHtml } from './escape-html.js';
import { ResendMailService } from './resend-mail.service.js';

type AccountMailUser = {
  email: string;
  username: string | null;
  organizationName: string | null;
};

const BUTTON_STYLE =
  'background:#944a00;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block';
const WRAP_STYLE =
  'font-family:Arial,sans-serif;color:#321716;line-height:1.6;max-width:560px';

/** Email tài khoản: xác nhận địa chỉ email khi đăng ký và thư chào mừng sau khi xác nhận. */
@Injectable()
export class AccountMailService {
  private readonly logger = new Logger(AccountMailService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly resend: ResendMailService,
  ) {}

  verifyUrl(token: string): string {
    return `${this.frontendUrl()}/xac-nhan-email/${token}`;
  }

  /** Trả về true nếu Resend nhận thư. */
  async sendVerification(
    user: AccountMailUser,
    token: string,
  ): Promise<boolean> {
    const url = this.verifyUrl(token);
    const clan = user.organizationName ? ` họ ${user.organizationName}` : '';
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`[dev] Link xác nhận email ${user.email}: ${url}`);
    }
    return this.deliver(user.email, 'verify', {
      subject: `[Cội Nguồn] Xác nhận email để kích hoạt gia phả${clan}`,
      html: `
        <div style="${WRAP_STYLE}">
          <h2>Chào ${escapeHtml(user.username ?? 'bạn')},</h2>
          <p>Cảm ơn bạn đã tạo gia phả${escapeHtml(clan)} trên Cội Nguồn. Bấm nút dưới đây để xác nhận email và kích hoạt tài khoản.</p>
          <p style="margin:24px 0"><a href="${escapeHtml(url)}" style="${BUTTON_STYLE}">Xác nhận email</a></p>
          <p style="color:#666;font-size:13px">Link có hiệu lực 24 giờ và chỉ dùng được một lần. Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
        </div>
      `.trim(),
      text: [
        `Chào ${user.username ?? 'bạn'},`,
        `Xác nhận email để kích hoạt gia phả${clan}: ${url}`,
        'Link có hiệu lực 24 giờ và chỉ dùng được một lần.',
      ].join('\n'),
    });
  }

  sendWelcome(user: AccountMailUser): void {
    void this.deliverWelcome(user);
  }

  private async deliverWelcome(user: AccountMailUser) {
    const base = this.frontendUrl();
    const clan = user.organizationName
      ? `họ ${user.organizationName}`
      : 'của bạn';
    const steps = [
      [
        'Thêm người đầu tiên',
        'Mở cây gia phả, bấm vào cụ tổ rồi thêm con cháu, vợ chồng.',
      ],
      [
        'Xem sổ gia phả',
        'Sổ tự sinh từ cây — có bìa, lời mở đầu, từng trang hồ sơ.',
      ],
      ['Tạo sự kiện', 'Giỗ tổ, họp họ, đóng góp — nhắc lịch cho cả dòng họ.'],
      [
        'Mời con cháu',
        'Gửi link xem gia phả cho người thân trong mục Tài khoản.',
      ],
    ];
    const loginUrl = `${base}/login`;
    await this.deliver(user.email, 'welcome', {
      subject: `[Cội Nguồn] Chào mừng bạn — gia phả ${clan} đã sẵn sàng`,
      html: `
        <div style="${WRAP_STYLE}">
          <h2>Chào mừng ${escapeHtml(user.username ?? 'bạn')} đến với Cội Nguồn!</h2>
          <p>Email đã được xác nhận. Gia phả ${escapeHtml(clan)} giờ là của riêng bạn — có cây gia phả, sổ gia phả, sự kiện… giống trang mẫu nhưng là thông tin gia đình bạn.</p>
          <p><strong>Bắt đầu trong vài phút:</strong></p>
          <ol>${steps.map(([t, d]) => `<li><strong>${escapeHtml(t)}</strong> — ${escapeHtml(d)}</li>`).join('')}</ol>
          <p style="margin:24px 0"><a href="${escapeHtml(base)}/" style="${BUTTON_STYLE}">Vào gia phả của tôi</a></p>
          <p style="color:#666;font-size:13px">Nếu chưa đăng nhập, dùng tên đăng nhập <strong>${escapeHtml(user.username ?? '')}</strong> hoặc email này tại <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a>. Hướng dẫn chi tiết: <a href="${escapeHtml(base)}/huong-dan">${escapeHtml(base)}/huong-dan</a>.</p>
        </div>
      `.trim(),
      text: [
        `Chào mừng ${user.username ?? 'bạn'} đến với Cội Nguồn!`,
        `Gia phả ${clan} đã sẵn sàng.`,
        ...steps.map(([t, d], i) => `${i + 1}. ${t} — ${d}`),
        `Vào gia phả: ${base}/`,
        `Đăng nhập: ${loginUrl}`,
      ].join('\n'),
    });
  }

  private async deliver(
    to: string,
    label: string,
    mail: { subject: string; html: string; text: string },
  ): Promise<boolean> {
    const result = await this.resend.send({ to, ...mail });
    if (result.ok)
      this.logger.log(`Đã gửi email tài khoản (${label}) tới ${to}`);
    else
      this.logger.error(
        `Gửi email tài khoản (${label}) thất bại: ${result.error}`,
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
