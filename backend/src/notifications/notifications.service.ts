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
import { PrismaService } from '../prisma/prisma.service.js';
import { OneSignalService } from './onesignal.service.js';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto.js';
import {
  daysUntilDeathAnniversary,
  formatLunarDeathDate,
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
  ) {}

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
      const subscribers = await this.prisma.user.findMany({
        where: {
          organizationId: person.organizationId,
          isActive: true,
          notificationDeathAnniversaryEnabled: true,
          pushSubscriptions: { some: {} },
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
        if (subscriptionIds.length === 0) continue;

        const data = {
          type: 'DEATH_ANNIVERSARY',
          personId: person.id,
          organizationId: person.organizationId,
          daysUntil,
        };

        const result = await this.oneSignal.sendNotification({
          subscriptionIds,
          title: message.title,
          content: message.body,
          data,
          url: this.buildCeremonyUrl(person.id),
        });

        await this.prisma.notificationLog.create({
          data: {
            organizationId: person.organizationId,
            userId: subscriber.id,
            personId: person.id,
            title: message.title,
            message: message.body,
            status: result.ok
              ? NotificationStatus.SENT
              : NotificationStatus.FAILED,
            sentAt: result.ok ? new Date() : null,
          },
        });

        if (result.ok) sentCount += 1;
      }
    }

    return { sentCount };
  }

  private buildCeremonyUrl(personId?: number): string | undefined {
    const base =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    if (personId == null) return `${base}/ceremonies/upcoming`;
    return `${base}/ceremonies/upcoming?personId=${personId}`;
  }
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
