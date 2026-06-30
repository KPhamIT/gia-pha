import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MailModule } from '../mail/mail.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OrganizationController } from './organization.controller.js';
import { OrganizationService } from './organization.service.js';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
