import { Module } from '@nestjs/common';
import { CronGuard } from '../auth/cron.guard.js';
import { MailModule } from '../mail/mail.module.js';
import { GioReminderController } from './gio-reminder.controller.js';
import { GioReminderService } from './gio-reminder.service.js';

@Module({
  imports: [MailModule],
  controllers: [GioReminderController],
  providers: [GioReminderService, CronGuard],
})
export class GioReminderModule {}
