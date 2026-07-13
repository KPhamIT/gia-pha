import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  AppFundContributionStatus,
  type User,
} from '../../generated/prisma/client.js';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { SystemGuard } from '../auth/system.guard.js';
import { AppFundService } from './app-fund.service.js';
import { CreateAppFundContributionDto } from './dto/create-app-fund-contribution.dto.js';
import { ReviewAppFundDto } from './dto/review-app-fund.dto.js';

@Controller('app-fund')
export class AppFundController {
  constructor(private readonly appFundService: AppFundService) {}

  @UseGuards(JwtRequiredGuard)
  @Get()
  summary(
    @Request() req: { user: User },
    @Query('organizationId') organizationId: string,
  ) {
    return this.appFundService.getSummary(+organizationId, req.user);
  }

  /** Thành viên dòng họ: đã chuyển khoản → chờ SYSTEM duyệt. */
  @UseGuards(JwtRequiredGuard)
  @Post('submit-paid')
  submitPaid(
    @Request() req: { user: User },
    @Body() dto: CreateAppFundContributionDto,
  ) {
    return this.appFundService.submitPaid(req.user, dto);
  }

  @UseGuards(SystemGuard)
  @Get('admin')
  listAdmin(@Query('status') status?: AppFundContributionStatus) {
    return this.appFundService.listAdmin(status);
  }

  @UseGuards(SystemGuard)
  @Post('admin/:id/confirm')
  confirm(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() body: ReviewAppFundDto,
  ) {
    return this.appFundService.confirm(+id, req.user, body);
  }

  @UseGuards(SystemGuard)
  @Post('admin/:id/reject')
  reject(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() body: ReviewAppFundDto,
  ) {
    return this.appFundService.reject(+id, req.user, body.reviewNote ?? '');
  }

  @UseGuards(JwtRequiredGuard)
  @Delete(':id')
  remove(@Request() req: { user: User }, @Param('id') id: string) {
    return this.appFundService.remove(req.user, +id);
  }
}
