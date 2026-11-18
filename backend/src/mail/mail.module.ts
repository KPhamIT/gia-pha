import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AccountMailService } from './account-mail.service.js';
import { AppFundMailService } from './app-fund-mail.service.js';
import { BillingMailService } from './billing-mail.service.js';
import { BlankBookMailService } from './blank-book-mail.service.js';
import { ContactMailService } from './contact-mail.service.js';
import { OrgRegistrationMailService } from './org-registration-mail.service.js';
import { ResendMailService } from './resend-mail.service.js';

@Module({
  imports: [PrismaModule],
  providers: [
    ResendMailService,
    AccountMailService,
    OrgRegistrationMailService,
    BillingMailService,
    AppFundMailService,
    ContactMailService,
    BlankBookMailService,
  ],
  exports: [
    ResendMailService,
    AccountMailService,
    OrgRegistrationMailService,
    BillingMailService,
    AppFundMailService,
    ContactMailService,
    BlankBookMailService,
  ],
})
export class MailModule {}
