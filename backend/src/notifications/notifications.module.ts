import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { OneSignalService } from './onesignal.service.js';
import { NotificationScheduler } from './notification.scheduler.js';
import { CronGuard } from '../auth/cron.guard.js';
import { OrganizationModule } from '../organization/organization.module.js';

const internalCronEnabled = process.env.ENABLE_INTERNAL_CRON === 'true';

@Module({
  imports: [OrganizationModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    OneSignalService,
    CronGuard,
    ...(internalCronEnabled ? [NotificationScheduler] : []),
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
