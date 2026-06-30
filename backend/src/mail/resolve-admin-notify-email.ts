import type { ConfigService } from '@nestjs/config';
import { UserRole, type PrismaClient } from '../../generated/prisma/client.js';

type NotifyScope = 'billing' | 'org-registration';

/** Email nhận thông báo vận hành (SYSTEM / billing / đăng ký dòng họ). */
export async function resolveAdminNotifyEmail(
  prisma: PrismaClient,
  config: ConfigService,
  scope: NotifyScope = 'org-registration',
): Promise<string | null> {
  if (scope === 'billing') {
    const billingOverride = config.get<string>('BILLING_NOTIFY_EMAIL')?.trim();
    if (billingOverride) return billingOverride;
  }

  const orgOverride = config
    .get<string>('ORG_REGISTRATION_NOTIFY_EMAIL')
    ?.trim();
  if (orgOverride) return orgOverride;

  const systemUser = await prisma.user.findFirst({
    where: {
      role: UserRole.SYSTEM,
      isActive: true,
      email: { not: null },
    },
    orderBy: { id: 'asc' },
    select: { email: true },
  });

  const email = systemUser?.email?.trim();
  return email || null;
}
