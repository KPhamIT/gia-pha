import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module.js';
import { BillingController, OrganizationBillingController } from './billing.controller.js';
import { BillingService } from './billing.service.js';

@Module({
  imports: [MailModule],
  controllers: [BillingController, OrganizationBillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
