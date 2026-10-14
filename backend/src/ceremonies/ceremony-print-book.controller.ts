import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SystemGuard } from '../auth/system.guard.js';
import { CeremonyPrintBookService } from './ceremony-print-book.service.js';
import { CeremonyPrintBookDto } from './dto/ceremony-print-book.dto.js';

/** Công cụ in sách văn khấn cho khách (trang /system/in-sach) — chỉ SYSTEM. */
@Controller('ceremonies/admin')
@UseGuards(SystemGuard)
export class CeremonyPrintBookController {
  constructor(private readonly printBook: CeremonyPrintBookService) {}

  @Get('templates')
  listTemplates() {
    return this.printBook.listTemplates();
  }

  @Post('print-book')
  renderBook(@Body() dto: CeremonyPrintBookDto) {
    return this.printBook.renderBook(dto.ids, dto.clanName);
  }
}
