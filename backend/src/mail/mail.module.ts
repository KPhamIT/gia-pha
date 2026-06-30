import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrgRegistrationMailService } from './org-registration-mail.service.js';
import { ResendMailService } from './resend-mail.service.js';

@Module({
  imports: [PrismaModule],
  providers: [ResendMailService, OrgRegistrationMailService],
  exports: [ResendMailService, OrgRegistrationMailService],
})
export class MailModule {}
