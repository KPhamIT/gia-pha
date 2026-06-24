import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NotificationStatus,
  type User,
} from '../../generated/prisma/client.js';
import {
  adminOrganizationId,
  assertOrgMemberAccess,
  isSystem,
} from '../auth/org-access.js';
import { createCeremonyShareToken } from '../ceremonies/ceremony-share-token.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OneSignalService } from './onesignal.service.js';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto.js';
import {
  daysUntilDeathAnniversary,
  formatLunarDeathDate,
  isPastDeathAnniversaryThisCycle,
} from './utils/lunar-death-anniversary.js';

export type DeathAnniversaryMessage = {
  daysUntil: number;
  title: string;
  body: string;
};

export function buildDeathAnniversaryMessage(
  fullName: string,
  daysUntil: number,
): DeathAnniversaryMessage {
  if (daysUntil === 3) {
    return {
      daysUntil,
      title: 'Sắp đến ngày giỗ',
      body: `Còn 3 ngày nữa là ngày giỗ của cụ ${fullName}.`,
    };
  }
  if (daysUntil === 2) {
    return {
      daysUntil,
      title: 'Sắp đến ngày giỗ',
      body: `Còn 2 ngày nữa là ngày giỗ của cụ ${fullName}.`,
    };
  }
  if (daysUntil === 1) {
    return {
      daysUntil,
      title: 'Ngày giỗ vào ngày mai',
      body: `Ngày mai là ngày giỗ của cụ ${fullName}.`,
    };
  }
  return {
    daysUntil: 0,
    title: 'Ngày giỗ hôm nay',
    body: `Hôm nay là ngày giỗ của cụ ${fullName}.\nNhấn để xem bài cúng.`,
  };
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oneSignal: OneSignalService,
    private readonly config: ConfigService,
    private readonly organizationService: OrganizationService,
  ) {}

  /** Danh sách thông báo ngày giỗ mẫu của org demo — công khai cho trang chủ. */
  async listDemoNotifications() {
    const orgId = await this.organizationService.getDemoOrganizationId();
    if (orgId == null) return [];
    const persons = await this.prisma.person.findMany({
      where: {
        organizationId: orgId,
        deathLunarDay: { not: null },
        deathLunarMonth: { not: null },
      },
      orderBy: [{ generation: 'asc' }, { fullName: 'asc' }],
      take: 10,
    });
    const now = new Date();
    return persons.map((person) => {
      const lunarDateLabel = formatLunarDeathDate(
        person.deathLunarMonth!,
        person.deathLunarDay!,
      );
      return {
        id: person.id,
        title: 'Nhắc ngày giỗ',
        message: `Ngày giỗ của cụ ${person.fullName} — ${lunarDateLabel}.\nNhấn để xem bài cúng.`,
        status: NotificationStatus.SENT,
        sentAt: now,
        createdAt: now,
        organizationId: orgId,
        person: { id: person.id, fullName: person.fullName },
      };
    });
  }

  async getSettings(user: User) {
    const subs = await this.prisma.userPushSubscription.findMany({
      where: { userId: user.id },
      select: { onesignalSubscriptionId: true },
      orderBy: { updatedAt: 'desc' },
    });
    return {
      notificationDeathAnniversaryEnabled:
        user.notificationDeathAnniversaryEnabled,
      notificationEventEnabled: user.notificationEventEnabled,
      notificationPostEnabled: user.notificationPostEnabled,
      onesignalSubscriptionId: user.onesignalSubscriptionId,
      pushSubscriptionCount: subs.length,
      pushSubscriptionIds: subs.map((s) => s.onesignalSubscriptionId),
    };
  }

  async updateSettings(user: User, dto: UpdateNotificationSettingsDto) {
    if (dto.removeOnesignalSubscriptionId) {
      await this.prisma.userPushSubscription.deleteMany({
        where: {
          userId: user.id,
          onesignalSubscriptionId: dto.removeOnesignalSubscriptionId,
        },
      });
    }

    if (dto.onesignalSubscriptionId) {
      await this.prisma.userPushSubscription.upsert({
        where: { onesignalSubscriptionId: dto.onesignalSubscriptionId },
        create: {
          userId: user.id,
          onesignalSubscriptionId: dto.onesignalSubscriptionId,
        },
        update: { userId: user.id },
      });
    } else if (
      dto.onesignalSubscriptionId === null &&
      !dto.removeOnesignalSubscriptionId
    ) {
      await this.prisma.userPushSubscription.deleteMany({
        where: { userId: user.id },
      });
    }

    const latestSub = await this.prisma.userPushSubscription.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        notificationDeathAnniversaryEnabled:
          dto.notificationDeathAnniversaryEnabled,
        notificationEventEnabled: dto.notificationEventEnabled,
        notificationPostEnabled: dto.notificationPostEnabled,
        onesignalSubscriptionId: latestSub?.onesignalSubscriptionId ?? null,
      },
    });
    return this.getSettings(updated);
  }

  async listForUser(user: User, limit = 50) {
    const logs = await this.prisma.notificationLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        person: { select: { id: true, fullName: true } },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      title: log.title,
      message: log.message,
      status: log.status,
      sentAt: log.sentAt,
      createdAt: log.createdAt,
      person: log.person,
      organizationId: log.organizationId,
    }));
  }

  async getOrgStats(actor: User) {
    const organizationId = isSystem(actor) ? null : adminOrganizationId(actor);

    const where = organizationId != null ? { organizationId } : {};

    const [totalMembers, subscribed] = await Promise.all([
      this.prisma.user.count({ where: { ...where, isActive: true } }),
      this.prisma.user.count({
        where: {
          ...where,
          isActive: true,
          notificationDeathAnniversaryEnabled: true,
          pushSubscriptions: { some: {} },
        },
      }),
    ]);

    const rate = totalMembers > 0 ? (subscribed / totalMembers) * 100 : 0;

    return {
      totalMembers,
      subscribed,
      rate: Math.round(rate * 10) / 10,
    };
  }

  async listUpcomingCeremonies(user: User) {
    if (user.organizationId == null) {
      throw new ForbiddenException('User is not assigned to an organization');
    }

    const persons = await this.prisma.person.findMany({
      where: {
        organizationId: user.organizationId,
        OR: [{ deceased: true }, { deathDate: { not: null } }],
        deathLunarDay: { not: null },
        deathLunarMonth: { not: null },
      },
      orderBy: { fullName: 'asc' },
    });

    return persons
      .map((person) => {
        const daysUntil = daysUntilDeathAnniversary(
          person.deathLunarMonth!,
          person.deathLunarDay!,
        );
        if (daysUntil == null) return null;
        return {
          personId: person.id,
          fullName: person.fullName,
          deathLunarDay: person.deathLunarDay,
          deathLunarMonth: person.deathLunarMonth,
          lunarDateLabel: formatLunarDeathDate(
            person.deathLunarMonth!,
            person.deathLunarDay!,
          ),
          daysUntil,
          message: buildDeathAnniversaryMessage(person.fullName, daysUntil)
            .body,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }

  async getUpcomingCeremony(user: User, personId: number) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    });
    if (!person) {
      throw new NotFoundException('Person not found');
    }
    assertOrgMemberAccess(user, person.organizationId);

    if (person.deathLunarDay == null || person.deathLunarMonth == null) {
      throw new NotFoundException('Person has no lunar death date configured');
    }

    const daysUntil = daysUntilDeathAnniversary(
      person.deathLunarMonth,
      person.deathLunarDay,
    );

    return {
      personId: person.id,
      fullName: person.fullName,
      deathLunarDay: person.deathLunarDay,
      deathLunarMonth: person.deathLunarMonth,
      lunarDateLabel: formatLunarDeathDate(
        person.deathLunarMonth,
        person.deathLunarDay,
      ),
      daysUntil,
    };
  }

  async sendNotification(
    userIds: number[],
    title: string,
    content: string,
    data?: Record<string, unknown>,
  ) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        isActive: true,
        pushSubscriptions: { some: {} },
      },
      include: { pushSubscriptions: true },
    });

    const subscriptionIds = users.flatMap((u) =>
      u.pushSubscriptions.map((s) => s.onesignalSubscriptionId),
    );

    return this.oneSignal.sendNotification({
      subscriptionIds,
      title,
      content,
      data,
      url: this.buildCeremonyUrl(data?.personId as number | undefined),
    });
  }

  async runDeathAnniversaryCron(referenceDate = new Date()) {
    const deletedLogCount =
      await this.cleanupExpiredDeathAnniversaryLogs(referenceDate);

    const persons = await this.prisma.person.findMany({
      where: {
        OR: [{ deceased: true }, { deathDate: { not: null } }],
        deathLunarDay: { not: null },
        deathLunarMonth: { not: null },
      },
      include: {
        organization: { select: { id: true, name: true } },
      },
    });

    let sentCount = 0;

    for (const person of persons) {
      const daysUntil = daysUntilDeathAnniversary(
        person.deathLunarMonth!,
        person.deathLunarDay!,
      );
      if (daysUntil == null) continue;

      const message = buildDeathAnniversaryMessage(person.fullName, daysUntil);
      // Lấy mọi user trong org đã bật nhắc giỗ, kể cả người chưa đăng ký push:
      // họ vẫn cần log in-app dù không nhận được thông báo đẩy.
      const subscribers = await this.prisma.user.findMany({
        where: {
          organizationId: person.organizationId,
          isActive: true,
          notificationDeathAnniversaryEnabled: true,
        },
        include: { pushSubscriptions: true },
      });

      for (const subscriber of subscribers) {
        const alreadySent = await this.prisma.notificationLog.findFirst({
          where: {
            userId: subscriber.id,
            personId: person.id,
            createdAt: { gte: startOfDay(referenceDate) },
            title: message.title,
          },
        });
        if (alreadySent) continue;

        const subscriptionIds = subscriber.pushSubscriptions.map(
          (s) => s.onesignalSubscriptionId,
        );

        const data = {
          type: 'DEATH_ANNIVERSARY',
          personId: person.id,
          organizationId: person.organizationId,
          daysUntil,
        };

        // Chỉ gửi push khi thiết bị có đăng ký; nếu không vẫn ghi log in-app.
        const result =
          subscriptionIds.length > 0
            ? await this.oneSignal.sendNotification({
                subscriptionIds,
                title: message.title,
                content: message.body,
                data,
                url: this.buildCeremonyUrl(person.id),
              })
            : null;

        const status =
          result == null
            ? NotificationStatus.SKIPPED
            : result.ok
              ? NotificationStatus.SENT
              : NotificationStatus.FAILED;

        await this.prisma.notificationLog.create({
          data: {
            organizationId: person.organizationId,
            userId: subscriber.id,
            personId: person.id,
            title: message.title,
            message: message.body,
            status,
            sentAt: status === NotificationStatus.SENT ? new Date() : null,
          },
        });

        if (status === NotificationStatus.SENT) sentCount += 1;
      }
    }

    return { sentCount, deletedLogCount };
  }

  /** Remove in-app notification history once this year's lunar death anniversary has passed. */
  async cleanupExpiredDeathAnniversaryLogs(referenceDate = new Date()) {
    const persons = await this.prisma.person.findMany({
      where: {
        deathLunarDay: { not: null },
        deathLunarMonth: { not: null },
      },
      select: { id: true, deathLunarDay: true, deathLunarMonth: true },
    });

    const pastPersonIds = persons
      .filter((p) =>
        isPastDeathAnniversaryThisCycle(
          p.deathLunarMonth!,
          p.deathLunarDay!,
          referenceDate,
        ),
      )
      .map((p) => p.id);

    if (pastPersonIds.length === 0) return 0;

    const result = await this.prisma.notificationLog.deleteMany({
      where: { personId: { in: pastPersonIds } },
    });
    return result.count;
  }

  private buildCeremonyUrl(personId?: number): string | undefined {
    const base =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    if (personId == null) return `${base}/ceremonies/upcoming`;
    const secret = this.config.get<string>('JWT_SECRET', 'change-me');
    const token = createCeremonyShareToken(personId, secret);
    return `${base}/ceremonies/share/${encodeURIComponent(token)}`;
  }
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
