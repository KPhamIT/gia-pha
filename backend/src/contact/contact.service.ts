import { Injectable } from '@nestjs/common';
import { ContactMailService } from '../mail/contact-mail.service.js';
import type { SubmitContactDto } from './dto/submit-contact.dto.js';

@Injectable()
export class ContactService {
  constructor(private readonly contactMail: ContactMailService) {}

  async submit(body: SubmitContactDto): Promise<{ ok: true }> {
    await this.contactMail.sendContactForm({
      name: body.name?.trim() || undefined,
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      subject: body.subject,
      message: body.message.trim(),
    });
    return { ok: true };
  }
}
