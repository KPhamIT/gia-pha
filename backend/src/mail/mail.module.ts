import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AppFundMailService } from './app-fund-mail.service.js';
import { BillingMailService } from './billing-mail.service.js';
import { ContactMailService } from './contact-mail.service.js';
import { OrgRegistrationMailService } from './org-registration-mail.service.js';
import { ResendMailService } from './resend-mail.service.js';

@Module({
  imports: [PrismaModule],
  providers: [
    ResendMailService,
    OrgRegistrationMailService,
    BillingMailService,
    AppFundMailService,
    ContactMailService,
  ],
  exports: [
    ResendMailService,
    OrgRegistrationMailService,
    BillingMailService,
    AppFundMailService,
    ContactMailService,
  ],
})
export class MailModule {}
