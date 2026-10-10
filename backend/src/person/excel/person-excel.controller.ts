import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import type { User } from '../../../generated/prisma/client.js';
import { FeatureMutateGuard } from '../../standard-features/feature-mutate.guard.js';
import { RequireFeature } from '../../standard-features/require-feature.decorator.js';
import { PersonExcelService } from './person-excel.service.js';

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function parseOrgId(value?: string): number | undefined {
  if (!value) return undefined;
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? undefined : id;
}

/** Nhập / xuất danh sách thành viên dòng họ bằng file Excel (quyền `editTree`). */
@Controller('person/excel')
export class PersonExcelController {
  constructor(private readonly personExcelService: PersonExcelService) {}

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Get('template')
  async download(
    @Request() req: { user: User },
    @Res() res: Response,
    @Query('blank') blank?: string,
    @Query('organizationId') organizationId?: string,
  ) {
    const isBlank = blank === '1' || blank === 'true';
    const { buffer } = await this.personExcelService.exportWorkbook(
      req.user,
      parseOrgId(organizationId),
      isBlank,
    );
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = isBlank
      ? 'mau-gia-pha-coi-nguon.xlsx'
      : `gia-pha-coi-nguon-${stamp}.xlsx`;
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.send(buffer);
  }

  @UseGuards(FeatureMutateGuard)
  @RequireFeature('editTree')
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 4 * 1024 * 1024 },
    }),
  )
  import(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Request() req: { user: User },
    @Query('dryRun') dryRun?: string,
    @Query('organizationId') organizationId?: string,
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Excel file is required');
    }
    return this.personExcelService.importWorkbook(
      req.user,
      file.buffer,
      parseOrgId(organizationId),
      dryRun !== '0' && dryRun !== 'false',
    );
  }
}
