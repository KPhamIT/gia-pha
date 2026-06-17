import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service.js';
import {
  ZALO_SITE_VERIFICATION_FILENAME,
  ZALO_SITE_VERIFICATION_HTML,
} from './zalo-site-verification.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(ZALO_SITE_VERIFICATION_FILENAME)
  @Header('Content-Type', 'text/html; charset=utf-8')
  getZaloSiteVerification(): string {
    return ZALO_SITE_VERIFICATION_HTML;
  }
}
