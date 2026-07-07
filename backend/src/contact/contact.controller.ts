import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactService } from './contact.service.js';
import { SubmitContactDto } from './dto/submit-contact.dto.js';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  submit(@Body() body: SubmitContactDto) {
    return this.contactService.submit(body);
  }
}
