import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module.js';
import { BlankBookController } from './blank-book.controller.js';
import { BlankBookService } from './blank-book.service.js';

@Module({
  imports: [MailModule],
  controllers: [BlankBookController],
  providers: [BlankBookService],
})
export class BlankBookModule {}
