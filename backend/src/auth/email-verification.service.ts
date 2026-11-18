import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AccountMailService } from '../mail/account-mail.service.js';
import {
  generateSecretToken,
  hashToken,
} from '../blank-book/blank-book-tokens.js';
import { AuthService } from './auth.service.js';
import { isEmailVerificationPending } from './email-verification.helpers.js';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${'*'.repeat(Math.max(1, name.length - visible.length))}@${domain}`;
}

/**
 * Token xác nhận email: 256-bit, chỉ lưu SHA-256, hạn 24h, dùng một lần.
 * GET chỉ xem — tài khoản chỉ được kích hoạt khi POST (bấm nút), để trình quét link của hộp thư không tự kích hoạt.
 */
@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: AccountMailService,
    private readonly authService: AuthService,
  ) {}

  /** Tạo token mới (vô hiệu token cũ) và gửi email. Trả về true nếu email được gửi đi. */
  async issue(userId: number): Promise<boolean> {
    const token = generateSecretToken();
    const now = new Date();
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerifyTokenHash: hashToken(token),
        emailVerifyExpiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
        emailVerifySentAt: now,
      },
      include: { organization: { select: { name: true } } },
    });
    if (!user.email) return false;
    return this.mail.sendVerification(
      {
        email: user.email,
        username: user.username,
        organizationName: user.organization?.name ?? null,
      },
      token,
    );
  }

  async getForVerify(token: string) {
    const user = await this.findByToken(token);
    return {
      username: user.username,
      email: maskEmail(user.email ?? ''),
      organizationName: user.organization?.name ?? null,
    };
  }

  async verify(token: string) {
    const user = await this.findByToken(token);
    const { count } = await this.prisma.user.updateMany({
      where: { id: user.id, emailVerifyTokenHash: user.emailVerifyTokenHash },
      data: {
        emailVerifiedAt: new Date(),
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
      },
    });
    if (count === 0) throw this.invalidLink();
    if (user.email) {
      this.mail.sendWelcome({
        email: user.email,
        username: user.username,
        organizationName: user.organization?.name ?? null,
      });
    }
    const verified = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    return this.authService.buildAuthResponse(verified);
  }

  /** Luôn trả ok (không lộ tài khoản nào tồn tại); chỉ gửi khi tài khoản đang chờ xác nhận. */
  async resend(login: string): Promise<{ ok: true }> {
    const normalized = login.trim();
    if (!normalized)
      throw new BadRequestException('Vui lòng nhập tên đăng nhập hoặc email');
    const user = await this.prisma.user.findFirst({
      where: {
        provider: 'local',
        OR: [
          { username: normalized },
          { email: { equals: normalized, mode: 'insensitive' } },
        ],
      },
    });
    if (!user || !isEmailVerificationPending(user)) return { ok: true };
    const sentAt = user.emailVerifySentAt?.getTime() ?? 0;
    if (Date.now() - sentAt < RESEND_COOLDOWN_MS) return { ok: true };
    await this.issue(user.id);
    return { ok: true };
  }

  private async findByToken(token: string) {
    if (!token || token.length > 128) throw this.invalidLink();
    const user = await this.prisma.user.findUnique({
      where: { emailVerifyTokenHash: hashToken(token) },
      include: { organization: { select: { name: true } } },
    });
    if (!user || user.emailVerifiedAt) throw this.invalidLink();
    if (!user.emailVerifyExpiresAt || user.emailVerifyExpiresAt < new Date()) {
      throw new GoneException(
        'Link xác nhận đã hết hạn. Hãy gửi lại email xác nhận.',
      );
    }
    return user;
  }

  private invalidLink() {
    return new NotFoundException(
      'Link xác nhận không hợp lệ hoặc đã được dùng. Nếu đã xác nhận, bạn có thể đăng nhập.',
    );
  }
}
