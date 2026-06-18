import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { OneSignalService } from './onesignal.service.js';
import { NotificationScheduler } from './notification.scheduler.js';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, OneSignalService, NotificationScheduler],
  exports: [NotificationsService],
})
export class NotificationsModule {}
