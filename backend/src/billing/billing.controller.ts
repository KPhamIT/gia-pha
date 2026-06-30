import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BillingOrderStatus, type User } from '../../generated/prisma/client.js';
import { JwtOptionalGuard } from '../auth/jwt-optional.guard.js';
import { JwtRequiredGuard } from '../auth/jwt-required.guard.js';
import { SystemGuard } from '../auth/system.guard.js';
import { BillingService } from './billing.service.js';
import { CreateBillingOrderDto } from './dto/create-billing-order.dto.js';
import { RejectBillingOrderDto } from './dto/reject-billing-order.dto.js';
import { ReviewBillingOrderDto } from './dto/review-billing-order.dto.js';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('config')
  getConfig() {
    return this.billingService.getPublicConfig();
  }

  @Get('quote')
  @UseGuards(JwtRequiredGuard)
  getQuote(
    @Query('organizationId', ParseIntPipe) organizationId: number,
    @Request() req: { user: User },
  ) {
    return this.billingService.getPaymentQuote(req.user, organizationId);
  }

  @Post('orders/submit-paid')
  @UseGuards(JwtRequiredGuard)
  submitPaid(
    @Request() req: { user: User },
    @Body() body: CreateBillingOrderDto,
  ) {
    return this.billingService.submitPaidOrder(req.user, body);
  }

  @Post('orders')
  @UseGuards(JwtRequiredGuard)
  createOrder(
    @Request() req: { user: User },
    @Body() body: CreateBillingOrderDto,
  ) {
    return this.billingService.createOrder(req.user, body);
  }

  @Get('orders')
  @UseGuards(SystemGuard)
  listOrders(
    @Query(
      'status',
      new ParseEnumPipe(BillingOrderStatus, { optional: true }),
    )
    status?: BillingOrderStatus,
  ) {
    return this.billingService.listOrders(status);
  }

  @Get('orders/by-code/:transferCode')
  getOrderByCode(@Param('transferCode') transferCode: string) {
    return this.billingService.getOrderByTransferCode(transferCode);
  }

  @Post('orders/:id/mark-paid')
  @UseGuards(JwtRequiredGuard)
  markPaid(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
  ) {
    return this.billingService.markOrderPaid(id, req.user);
  }

  @Post('orders/:id/confirm')
  @UseGuards(SystemGuard)
  confirm(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
    @Body() body: ReviewBillingOrderDto,
  ) {
    return this.billingService.confirmOrder(id, req.user, body);
  }

  @Post('orders/:id/reject')
  @UseGuards(SystemGuard)
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
    @Body() body: RejectBillingOrderDto,
  ) {
    return this.billingService.rejectOrder(id, req.user, body.reviewNote);
  }

  @Post('orders/:id/cancel')
  @UseGuards(JwtRequiredGuard)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
  ) {
    return this.billingService.cancelOrder(id, req.user);
  }
}

@Controller('organizations')
export class OrganizationBillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get(':id/subscription')
  @UseGuards(JwtRequiredGuard)
  getSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
  ) {
    return this.billingService.getSubscriptionSummary(id, req.user);
  }

  @Get(':id/export-download-eligibility')
  @UseGuards(JwtOptionalGuard)
  getExportEligibility(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user?: User | null },
    @Query('nodeCount') nodeCountRaw?: string,
    @Query('orgToken') orgToken?: string,
  ) {
    const nodeCount = Number.parseInt(nodeCountRaw ?? '', 10);
    if (!Number.isFinite(nodeCount) || nodeCount < 0) {
      return { allowed: false, reason: 'INVALID_NODE_COUNT' };
    }
    this.billingService.assertOrgContext(req.user, id, orgToken);
    return this.billingService.getExportDownloadEligibility(
      id,
      nodeCount,
      req.user,
    );
  }
}
