import { Controller, Get, Param } from '@nestjs/common';
import { CeremonyPublicService } from './ceremony-public.service.js';

/** API công khai (không cần đăng nhập) cho trang văn khấn /van-khan. */
@Controller('public/ceremonies')
export class CeremonyPublicController {
  constructor(private readonly ceremonyPublicService: CeremonyPublicService) {}

  @Get()
  list() {
    return this.ceremonyPublicService.list();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.ceremonyPublicService.findBySlug(slug);
  }
}
