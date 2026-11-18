import { ForbiddenException } from '@nestjs/common';

export const EMAIL_NOT_VERIFIED_CODE = 'EMAIL_NOT_VERIFIED';

/** Đang chờ xác nhận = còn hash token và chưa có emailVerifiedAt. Tài khoản cũ không bị ảnh hưởng. */
export function isEmailVerificationPending(user: {
  emailVerifyTokenHash: string | null;
  emailVerifiedAt: Date | null;
}): boolean {
  return Boolean(user.emailVerifyTokenHash) && !user.emailVerifiedAt;
}

export function emailNotVerifiedError(): ForbiddenException {
  return new ForbiddenException({
    statusCode: 403,
    code: EMAIL_NOT_VERIFIED_CODE,
    message:
      'Email chưa được xác nhận. Mở email chúng tôi đã gửi và bấm "Xác nhận email", hoặc gửi lại email xác nhận.',
  });
}
