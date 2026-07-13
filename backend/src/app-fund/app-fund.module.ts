import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module.js';
import { AppFundController } from './app-fund.controller.js';
import { AppFundService } from './app-fund.service.js';

@Module({
  imports: [MailModule],
  controllers: [AppFundController],
  providers: [AppFundService],
})
export class AppFundModule {}
