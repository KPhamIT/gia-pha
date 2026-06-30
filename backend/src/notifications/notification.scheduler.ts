import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service.js';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  /** Mỗi ngày 00:00 Asia/Ho_Chi_Minh (khớp GitHub Actions `0 17 * * *` UTC). */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleDeathAnniversaryNotifications() {
    this.logger.log('Running death anniversary notification cron');
    try {
      const result = await this.notificationsService.runDeathAnniversaryCron();
      this.logger.log(
        `Death anniversary cron finished: sent=${result.sentCount}, deletedLogs=${result.deletedLogCount}`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Death anniversary cron failed: ${message}`);
    }
  }
}
