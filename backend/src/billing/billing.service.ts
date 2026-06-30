import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BillingOrderStatus,
  SubscriptionStatus,
  SubscriptionTier,
  type User,
} from '../../generated/prisma/client.js';
import {
  assertOrgAccess,
  assertOrgMemberAccess,
  isSystem,
} from '../auth/org-access.js';
import { verifyOrgAccessToken } from '../organization/org-access-token.js';
import type { BillingOrderMailPayload } from '../mail/billing-mail.service.js';
import { BillingMailService } from '../mail/billing-mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  priceVndForTier,
  tierForPersonCount,
  tierPublicView,
  tierRank,
  TIER_CATALOG,
} from './billing-tier.js';
import { generateTransferCode } from './transfer-code.js';
import type { CreateBillingOrderDto } from './dto/create-billing-order.dto.js';
import type { ReviewBillingOrderDto } from './dto/review-billing-order.dto.js';

const OPEN_ORDER_STATUSES: BillingOrderStatus[] = [
  BillingOrderStatus.PENDING_PAYMENT,
  BillingOrderStatus.AWAITING_REVIEW,
];

export type ExportEligibilityReason =
  | 'NO_SUBSCRIPTION'
  | 'TIER_TOO_LOW'
  | 'EXPIRED'
  | 'ENTERPRISE_REQUIRED'
  | 'DEMO';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly billingMail: BillingMailService,
  ) {}

  isBillingEnforced(): boolean {
    return this.config.get<string>('BILLING_ENFORCE', 'true') !== 'false';
  }

  getFreeDownloadMaxNodes(): number {
    const raw = this.config.get<string>('EXPORT_FREE_DOWNLOAD_MAX_NODES', '30');
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
  }

  getOrderExpireDays(): number {
    const raw = this.config.get<string>('BILLING_ORDER_EXPIRE_DAYS', '7');
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 7;
  }

  getPublicConfig() {
    return {
      billingEnabled: this.isBillingEnforced(),
      freeDownloadMaxNodes: this.getFreeDownloadMaxNodes(),
      orderExpireDays: this.getOrderExpireDays(),
      qrImageUrl: this.config.get<string>('PAYMENT_QR_URL', '/images/payment-qr.png'),
      accountName: this.config.get<string>('PAYMENT_ACCOUNT_NAME', ''),
      accountNumber: this.config.get<string>('PAYMENT_ACCOUNT_NUMBER', ''),
      bankName: this.config.get<string>('PAYMENT_BANK_NAME', ''),
      tiers: (Object.keys(TIER_CATALOG) as SubscriptionTier[]).map(tierPublicView),
    };
  }

  async countPersons(organizationId: number): Promise<number> {
    return this.prisma.person.count({ where: { organizationId } });
  }

  async getActiveSubscription(organizationId: number) {
    const now = new Date();
    return this.prisma.organizationSubscription.findFirst({
      where: {
        organizationId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: now },
      },
      orderBy: { expiresAt: 'desc' },
    });
  }

  async getExportDownloadEligibility(
    organizationId: number,
    nodeCount: number,
    user?: User | null,
  ) {
    if (!this.isBillingEnforced()) {
      return { allowed: true as const };
    }

    if (user?.isDemo && nodeCount >= this.getFreeDownloadMaxNodes()) {
      return {
        allowed: false as const,
        reason: 'DEMO' as ExportEligibilityReason,
        nodeCount,
      };
    }

    const freeMax = this.getFreeDownloadMaxNodes();
    if (nodeCount < freeMax) {
      return { allowed: true as const, nodeCount };
    }

    const personCount = await this.countPersons(organizationId);
    const requiredTier = tierForPersonCount(personCount);
    if (!requiredTier) {
      return {
        allowed: false as const,
        reason: 'ENTERPRISE_REQUIRED' as ExportEligibilityReason,
        nodeCount,
        personCount,
      };
    }

    const sub = await this.getActiveSubscription(organizationId);
    if (!sub) {
      return {
        allowed: false as const,
        reason: 'NO_SUBSCRIPTION' as ExportEligibilityReason,
        nodeCount,
        personCount,
        requiredTier,
        requiredTierLabel: TIER_CATALOG[requiredTier].label,
      };
    }

    if (sub.expiresAt <= new Date()) {
      return {
        allowed: false as const,
        reason: 'EXPIRED' as ExportEligibilityReason,
        nodeCount,
        personCount,
        requiredTier,
        expiresAt: sub.expiresAt.toISOString(),
      };
    }

    if (tierRank(sub.tier) < tierRank(requiredTier)) {
      return {
        allowed: false as const,
        reason: 'TIER_TOO_LOW' as ExportEligibilityReason,
        nodeCount,
        personCount,
        requiredTier,
        currentTier: sub.tier,
        expiresAt: sub.expiresAt.toISOString(),
      };
    }

    return {
      allowed: true as const,
      nodeCount,
      personCount,
      tier: sub.tier,
      expiresAt: sub.expiresAt.toISOString(),
    };
  }

  async getSubscriptionSummary(organizationId: number, user: User) {
    assertOrgMemberAccess(user, organizationId);
    const personCount = await this.countPersons(organizationId);
    const requiredTier = tierForPersonCount(personCount);
    const active = await this.getActiveSubscription(organizationId);
    return {
      personCount,
      requiredTier,
      requiredTierLabel: requiredTier ? TIER_CATALOG[requiredTier].label : null,
      active: active
        ? {
            id: active.id,
            tier: active.tier,
            tierLabel: TIER_CATALOG[active.tier].label,
            status: active.status,
            startsAt: active.startsAt.toISOString(),
            expiresAt: active.expiresAt.toISOString(),
            amountVnd: active.amountVnd,
          }
        : null,
    };
  }

  assertOrgContext(
    user: User | null | undefined,
    organizationId: number,
    orgToken?: string,
  ): void {
    if (user) {
      assertOrgMemberAccess(user, organizationId);
      return;
    }
    const resolved = orgToken
      ? verifyOrgAccessToken(orgToken, this.jwtSecret())
      : null;
    if (resolved !== organizationId) {
      throw new ForbiddenException('No access to this organization');
    }
  }

  async getPaymentQuote(user: User, organizationId: number) {
    assertOrgAccess(user, organizationId);

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const personCount = await this.countPersons(organizationId);
    const tier = tierForPersonCount(personCount);
    if (!tier) {
      throw new BadRequestException(
        'Dòng họ vượt quá 3.000 thành viên. Vui lòng liên hệ báo giá riêng.',
      );
    }

    const openOrder = await this.findOpenOrder(organizationId);

    return {
      organizationId: org.id,
      organizationName: org.name,
      personCount,
      tier,
      tierLabel: TIER_CATALOG[tier].label,
      amountVnd: priceVndForTier(tier),
      bankDisplay: this.bankDisplay(),
      openOrder: openOrder
        ? this.serializeOrder(openOrder, openOrder.organization.name)
        : null,
    };
  }

  async submitPaidOrder(user: User, dto: CreateBillingOrderDto) {
    assertOrgAccess(user, dto.organizationId);

    const personCount = await this.countPersons(dto.organizationId);
    const tier = tierForPersonCount(personCount);
    if (!tier) {
      throw new BadRequestException(
        'Dòng họ vượt quá 3.000 thành viên. Vui lòng liên hệ báo giá riêng.',
      );
    }

    const openOrder = await this.findOpenOrder(dto.organizationId);
    if (openOrder?.status === BillingOrderStatus.AWAITING_REVIEW) {
      return this.serializeOrder(openOrder, openOrder.organization.name);
    }

    const now = new Date();
    const amountVnd = priceVndForTier(tier);
    const expiresAt = this.orderExpiresAt();
    const contact = {
      contactName: dto.contactName?.trim() || null,
      contactPhone: dto.contactPhone?.trim() || null,
      contactEmail: dto.contactEmail?.trim() || null,
      note: dto.note?.trim() || null,
    };

    if (openOrder?.status === BillingOrderStatus.PENDING_PAYMENT) {
      const updated = await this.prisma.billingOrder.update({
        where: { id: openOrder.id },
        data: {
          ...contact,
          status: BillingOrderStatus.AWAITING_REVIEW,
          paidAt: now,
        },
        include: { organization: { select: { name: true } } },
      });
      const result = this.serializeOrder(updated, updated.organization.name);
      this.billingMail.notifySubmitted(
        this.toMailPayload(updated, updated.organization.name),
      );
      return result;
    }

    try {
      const order = await this.prisma.billingOrder.create({
        data: {
          organizationId: dto.organizationId,
          transferCode: await this.generateUniqueTransferCode(),
          tier,
          personCountAtOrder: personCount,
          amountVnd,
          status: BillingOrderStatus.AWAITING_REVIEW,
          paidAt: now,
          ...contact,
          expiresAt,
        },
        include: { organization: { select: { name: true } } },
      });
      const result = this.serializeOrder(order, order.organization.name);
      this.billingMail.notifySubmitted(
        this.toMailPayload(order, order.organization.name),
      );
      return result;
    } catch (error) {
      if (this.isOpenOrderUniqueViolation(error)) {
        const retry = await this.findOpenOrder(dto.organizationId);
        if (retry) {
          return this.serializeOrder(retry, retry.organization.name);
        }
      }
      throw error;
    }
  }

  /** @deprecated Dùng submitPaidOrder — giữ cho tương thích nội bộ */
  async createOrder(user: User, dto: CreateBillingOrderDto) {
    assertOrgAccess(user, dto.organizationId);

    const personCount = await this.countPersons(dto.organizationId);
    const tier = tierForPersonCount(personCount);
    if (!tier) {
      throw new BadRequestException(
        'Dòng họ vượt quá 3.000 thành viên. Vui lòng liên hệ báo giá riêng.',
      );
    }

    const openOrder = await this.findOpenOrder(dto.organizationId);
    if (openOrder) {
      return this.serializeOrder(openOrder, openOrder.organization.name);
    }

    const amountVnd = priceVndForTier(tier);
    const expiresAt = this.orderExpiresAt();

    try {
      const order = await this.prisma.billingOrder.create({
        data: {
          organizationId: dto.organizationId,
          transferCode: await this.generateUniqueTransferCode(),
          tier,
          personCountAtOrder: personCount,
          amountVnd,
          status: BillingOrderStatus.PENDING_PAYMENT,
          contactName: dto.contactName?.trim() || null,
          contactPhone: dto.contactPhone?.trim() || null,
          contactEmail: dto.contactEmail?.trim() || null,
          note: dto.note?.trim() || null,
          expiresAt,
        },
        include: { organization: { select: { name: true } } },
      });
      return this.serializeOrder(order, order.organization.name);
    } catch (error) {
      if (this.isOpenOrderUniqueViolation(error)) {
        const retry = await this.findOpenOrder(dto.organizationId);
        if (retry) {
          return this.serializeOrder(retry, retry.organization.name);
        }
      }
      throw error;
    }
  }

  async getOrderByTransferCode(transferCode: string) {
    const order = await this.prisma.billingOrder.findUnique({
      where: { transferCode },
      include: { organization: { select: { name: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.serializeOrder(order, order.organization.name);
  }

  async markOrderPaid(orderId: number, user: User) {
    const order = await this.findOrderOrThrow(orderId);
    assertOrgAccess(user, order.organizationId);
    if (
      order.status !== BillingOrderStatus.PENDING_PAYMENT &&
      order.status !== BillingOrderStatus.AWAITING_REVIEW
    ) {
      throw new BadRequestException('Đơn không thể cập nhật trạng thái');
    }
    if (order.expiresAt <= new Date()) {
      await this.prisma.billingOrder.update({
        where: { id: order.id },
        data: { status: BillingOrderStatus.EXPIRED },
      });
      throw new BadRequestException('Đơn đã hết hạn');
    }

    const wasPending = order.status === BillingOrderStatus.PENDING_PAYMENT;

    const updated = await this.prisma.billingOrder.update({
      where: { id: order.id },
      data: {
        status: BillingOrderStatus.AWAITING_REVIEW,
        paidAt: new Date(),
      },
      include: { organization: { select: { name: true } } },
    });
    const result = this.serializeOrder(updated, updated.organization.name);
    if (wasPending) {
      this.billingMail.notifySubmitted(
        this.toMailPayload(updated, updated.organization.name),
      );
    }
    return result;
  }

  async listOrders(status?: BillingOrderStatus) {
    const orders = await this.prisma.billingOrder.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { organization: { select: { name: true } } },
      take: 200,
    });
    return orders.map((order) => this.serializeOrder(order, order.organization.name));
  }

  async confirmOrder(orderId: number, user: User, dto: ReviewBillingOrderDto) {
    const order = await this.findOrderOrThrow(orderId);
    if (
      order.status !== BillingOrderStatus.AWAITING_REVIEW &&
      order.status !== BillingOrderStatus.PENDING_PAYMENT
    ) {
      throw new BadRequestException('Đơn không ở trạng thái chờ duyệt');
    }

    const now = new Date();
    const active = await this.getActiveSubscription(order.organizationId);
    const startsAt = now;
    const baseExpiry = active && active.expiresAt > now ? active.expiresAt : now;
    const expiresAt = new Date(baseExpiry);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const result = await this.prisma.$transaction(async (tx) => {
      if (active) {
        await tx.organizationSubscription.update({
          where: { id: active.id },
          data: { status: SubscriptionStatus.EXPIRED },
        });
      }

      const subscription = await tx.organizationSubscription.create({
        data: {
          organizationId: order.organizationId,
          tier: order.tier,
          personCountAtPurchase: order.personCountAtOrder,
          status: SubscriptionStatus.ACTIVE,
          startsAt,
          expiresAt,
          amountVnd: order.amountVnd,
          billingOrderId: order.id,
          paymentRef: dto.paymentRef?.trim() || null,
          activatedByUserId: user.id,
        },
      });

      const updatedOrder = await tx.billingOrder.update({
        where: { id: order.id },
        data: {
          status: BillingOrderStatus.CONFIRMED,
          reviewedAt: now,
          reviewedByUserId: user.id,
          reviewNote: dto.reviewNote?.trim() || null,
          paidAt: order.paidAt ?? now,
        },
        include: { organization: { select: { name: true } } },
      });

      return {
        order: this.serializeOrder(updatedOrder, updatedOrder.organization.name),
        subscription: {
          id: subscription.id,
          tier: subscription.tier,
          expiresAt: subscription.expiresAt.toISOString(),
        },
        mailPayload: this.toMailPayload(
          updatedOrder,
          updatedOrder.organization.name,
        ),
        subscriptionExpiresAt: subscription.expiresAt,
      };
    });

    const { mailPayload, subscriptionExpiresAt, ...response } = result;
    this.billingMail.notifyConfirmed(mailPayload, subscriptionExpiresAt);
    return response;
  }

  async rejectOrder(orderId: number, user: User, reviewNote: string) {
    const order = await this.findOrderOrThrow(orderId);
    if (
      order.status !== BillingOrderStatus.AWAITING_REVIEW &&
      order.status !== BillingOrderStatus.PENDING_PAYMENT
    ) {
      throw new BadRequestException('Đơn không ở trạng thái chờ duyệt');
    }

    const updated = await this.prisma.billingOrder.update({
      where: { id: order.id },
      data: {
        status: BillingOrderStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedByUserId: user.id,
        reviewNote: reviewNote.trim(),
      },
      include: { organization: { select: { name: true } } },
    });
    const result = this.serializeOrder(updated, updated.organization.name);
    this.billingMail.notifyRejected(
      this.toMailPayload(updated, updated.organization.name),
      reviewNote.trim(),
    );
    return result;
  }

  async cancelOrder(orderId: number, user: User) {
    const order = await this.findOrderOrThrow(orderId);
    if (!isSystem(user)) {
      assertOrgAccess(user, order.organizationId);
    }
    if (
      order.status !== BillingOrderStatus.PENDING_PAYMENT &&
      order.status !== BillingOrderStatus.AWAITING_REVIEW
    ) {
      throw new BadRequestException('Đơn không thể hủy');
    }

    const updated = await this.prisma.billingOrder.update({
      where: { id: order.id },
      data: { status: BillingOrderStatus.CANCELLED },
      include: { organization: { select: { name: true } } },
    });
    return this.serializeOrder(updated, updated.organization.name);
  }

  private bankDisplay() {
    return {
      qrImageUrl: this.config.get<string>('PAYMENT_QR_URL', '/images/payment-qr.svg'),
      accountName: this.config.get<string>('PAYMENT_ACCOUNT_NAME', ''),
      accountNumber: this.config.get<string>('PAYMENT_ACCOUNT_NUMBER', ''),
      bankName: this.config.get<string>('PAYMENT_BANK_NAME', ''),
    };
  }

  private jwtSecret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  private orderExpiresAt(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.getOrderExpireDays());
    return expiresAt;
  }

  private async findOpenOrder(organizationId: number) {
    return this.prisma.billingOrder.findFirst({
      where: {
        organizationId,
        status: { in: OPEN_ORDER_STATUSES },
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      include: { organization: { select: { name: true } } },
    });
  }

  private async generateUniqueTransferCode(): Promise<string> {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const transferCode = generateTransferCode();
      const collision = await this.prisma.billingOrder.findUnique({
        where: { transferCode },
      });
      if (!collision) return transferCode;
    }
    throw new BadRequestException('Không thể tạo mã đơn, vui lòng thử lại');
  }

  private isOpenOrderUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    );
  }

  private async findOrderOrThrow(orderId: number) {
    const order = await this.prisma.billingOrder.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private toMailPayload(
    order: {
      id: number;
      organizationId: number;
      transferCode: string;
      tier: SubscriptionTier;
      personCountAtOrder: number;
      amountVnd: number;
      contactName: string | null;
      contactPhone: string | null;
      contactEmail: string | null;
      note: string | null;
    },
    organizationName: string,
  ): BillingOrderMailPayload {
    return {
      id: order.id,
      organizationId: order.organizationId,
      organizationName,
      transferCode: order.transferCode,
      tier: order.tier,
      amountVnd: order.amountVnd,
      personCountAtOrder: order.personCountAtOrder,
      contactName: order.contactName,
      contactPhone: order.contactPhone,
      contactEmail: order.contactEmail,
      note: order.note,
    };
  }

  private serializeOrder(
    order: {
      id: number;
      organizationId: number;
      transferCode: string;
      tier: SubscriptionTier;
      personCountAtOrder: number;
      amountVnd: number;
      status: BillingOrderStatus;
      contactName: string | null;
      contactPhone: string | null;
      contactEmail: string | null;
      note: string | null;
      paidAt: Date | null;
      reviewedAt: Date | null;
      reviewNote: string | null;
      expiresAt: Date;
      createdAt: Date;
    },
    organizationName: string,
  ) {
    return {
      id: order.id,
      organizationId: order.organizationId,
      organizationName,
      transferCode: order.transferCode,
      tier: order.tier,
      tierLabel: TIER_CATALOG[order.tier].label,
      personCountAtOrder: order.personCountAtOrder,
      amountVnd: order.amountVnd,
      status: order.status,
      contactName: order.contactName,
      contactPhone: order.contactPhone,
      contactEmail: order.contactEmail,
      note: order.note,
      paidAt: order.paidAt?.toISOString() ?? null,
      reviewedAt: order.reviewedAt?.toISOString() ?? null,
      reviewNote: order.reviewNote,
      expiresAt: order.expiresAt.toISOString(),
      createdAt: order.createdAt.toISOString(),
      bankDisplay: this.bankDisplay(),
    };
  }
}
