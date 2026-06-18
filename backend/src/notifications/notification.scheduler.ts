import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service.js';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  /** Every day at 07:00 Asia/Ho_Chi_Minh */
  @Cron(CronExpression.EVERY_DAY_AT_7AM, { timeZone: 'Asia/Ho_Chi_Minh' })
  async handleDeathAnniversaryNotifications() {
    this.logger.log('Running death anniversary notification cron');
    try {
      const result = await this.notificationsService.runDeathAnniversaryCron();
      this.logger.log(`Death anniversary cron finished: sent=${result.sentCount}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Death anniversary cron failed: ${message}`);
    }
  }
}
