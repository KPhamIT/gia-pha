import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppFundContributionStatus,
  SubscriptionStatus,
  type User,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  assertOrgAccess,
  assertOrgMemberAccess,
  canMutate,
} from '../auth/org-access.js';
import {
  priceVndForTier,
  tierForPersonCount,
  TIER_CATALOG,
} from '../billing/billing-tier.js';
import { generateTransferCode } from '../billing/transfer-code.js';
import {
  AppFundMailService,
  type AppFundMailPayload,
} from '../mail/app-fund-mail.service.js';
import { CreateAppFundContributionDto } from './dto/create-app-fund-contribution.dto.js';
import type { ReviewAppFundDto } from './dto/review-app-fund.dto.js';

@Injectable()
export class AppFundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly appFundMail: AppFundMailService,
  ) {}

  async getSummary(organizationId: number, user?: User | null) {
    if (user) assertOrgMemberAccess(user, organizationId);
    await this.ensureOrg(organizationId);

    const [personCount, contributions, active] = await Promise.all([
      this.prisma.person.count({ where: { organizationId } }),
      this.prisma.orgAppFundContribution.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organizationSubscription.findFirst({
        where: {
          organizationId,
          status: SubscriptionStatus.ACTIVE,
          expiresAt: { gt: new Date() },
        },
        orderBy: { expiresAt: 'desc' },
      }),
    ]);

    const requiredTier = tierForPersonCount(personCount);
    const requiredAmountVnd = requiredTier
      ? priceVndForTier(requiredTier)
      : 0;
    const totalRaisedVnd = contributions
      .filter((row) => row.status === AppFundContributionStatus.CONFIRMED)
      .reduce((sum, row) => sum + row.amount, 0);
    const shortfallVnd = Math.max(0, requiredAmountVnd - totalRaisedVnd);
    const now = Date.now();
    const expiresAt = active?.expiresAt ?? null;
    const daysUntilExpiry =
      expiresAt != null
        ? Math.ceil((expiresAt.getTime() - now) / (24 * 60 * 60 * 1000))
        : null;

    return {
      organizationId,
      personCount,
      requiredTier,
      requiredTierLabel: requiredTier ? TIER_CATALOG[requiredTier].label : null,
      requiredAmountVnd,
      totalRaisedVnd,
      shortfallVnd,
      subscriptionExpiresAt: expiresAt?.toISOString() ?? null,
      daysUntilExpiry,
      hasActiveSubscription: active != null,
      bankDisplay: this.bankDisplay(),
      contributions: contributions.map((row) => this.serialize(row)),
    };
  }

  /** Tạo yêu cầu chuyển khoản — SYSTEM duyệt mới cộng quỹ. */
  async submitPaid(user: User, dto: CreateAppFundContributionDto) {
    assertOrgMemberAccess(user, dto.organizationId);
    const org = await this.ensureOrg(dto.organizationId);

    if (dto.personId != null) {
      const person = await this.prisma.person.findFirst({
        where: { id: dto.personId, organizationId: dto.organizationId },
        select: { id: true },
      });
      if (!person) throw new NotFoundException('Person not found');
    }

    const donorEmail =
      dto.contactEmail?.trim() || user.email?.trim() || null;

    const created = await this.prisma.orgAppFundContribution.create({
      data: {
        organizationId: dto.organizationId,
        donorName: dto.donorName.trim(),
        amount: dto.amount,
        personId: dto.personId,
        note: dto.note?.trim() || null,
        contactEmail: donorEmail,
        createdByUserId: user.id,
        status: AppFundContributionStatus.AWAITING_REVIEW,
        transferCode: await this.generateUniqueTransferCode(),
      },
    });

    this.appFundMail.notifySubmitted(
      this.toMailPayload(created, org.name, donorEmail),
    );

    return {
      contribution: this.serialize(created),
      summary: await this.getSummary(dto.organizationId, user),
    };
  }

  async listAdmin(status?: AppFundContributionStatus) {
    const rows = await this.prisma.orgAppFundContribution.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { organization: { select: { name: true } } },
      take: 200,
    });
    return rows.map((row) => ({
      ...this.serialize(row),
      organizationName: row.organization.name,
    }));
  }

  async confirm(id: number, user: User, dto: ReviewAppFundDto) {
    const row = await this.findOrThrow(id);
    if (row.status !== AppFundContributionStatus.AWAITING_REVIEW) {
      throw new BadRequestException('Khoản không ở trạng thái chờ duyệt');
    }

    const updated = await this.prisma.orgAppFundContribution.update({
      where: { id },
      data: {
        status: AppFundContributionStatus.CONFIRMED,
        reviewedAt: new Date(),
        reviewedByUserId: user.id,
        reviewNote: dto.reviewNote?.trim() || null,
      },
      include: {
        organization: { select: { name: true } },
        createdBy: { select: { email: true } },
      },
    });

    this.appFundMail.notifyConfirmed(
      this.toMailPayload(
        updated,
        updated.organization.name,
        updated.contactEmail ?? updated.createdBy?.email ?? null,
      ),
    );

    return {
      ...this.serialize(updated),
      organizationName: updated.organization.name,
    };
  }

  async reject(id: number, user: User, reviewNote: string) {
    const row = await this.findOrThrow(id);
    if (row.status !== AppFundContributionStatus.AWAITING_REVIEW) {
      throw new BadRequestException('Khoản không ở trạng thái chờ duyệt');
    }
    if (!reviewNote?.trim()) {
      throw new BadRequestException('Vui lòng nhập lý do từ chối');
    }

    const updated = await this.prisma.orgAppFundContribution.update({
      where: { id },
      data: {
        status: AppFundContributionStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedByUserId: user.id,
        reviewNote: reviewNote.trim(),
      },
      include: {
        organization: { select: { name: true } },
        createdBy: { select: { email: true } },
      },
    });

    this.appFundMail.notifyRejected(
      this.toMailPayload(
        updated,
        updated.organization.name,
        updated.contactEmail ?? updated.createdBy?.email ?? null,
      ),
      reviewNote.trim(),
    );

    return {
      ...this.serialize(updated),
      organizationName: updated.organization.name,
    };
  }

  async remove(user: User, id: number) {
    if (!canMutate(user)) {
      throw new ForbiddenException('Only admin can remove contributions');
    }
    const row = await this.findOrThrow(id);
    assertOrgAccess(user, row.organizationId);
    if (row.status === AppFundContributionStatus.AWAITING_REVIEW) {
      throw new BadRequestException(
        'Khoản đang chờ duyệt — hãy để SYSTEM từ chối hoặc đợi duyệt',
      );
    }
    await this.prisma.orgAppFundContribution.delete({ where: { id } });
    return this.getSummary(row.organizationId, user);
  }

  private async findOrThrow(id: number) {
    const row = await this.prisma.orgAppFundContribution.findUnique({
      where: { id },
    });
    if (!row) throw new NotFoundException('Contribution not found');
    return row;
  }

  private async ensureOrg(organizationId: number) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  private toMailPayload(
    row: {
      id: number;
      organizationId: number;
      donorName: string;
      amount: number;
      transferCode: string | null;
      note: string | null;
    },
    organizationName: string,
    donorEmail: string | null,
  ): AppFundMailPayload {
    return {
      id: row.id,
      organizationId: row.organizationId,
      organizationName,
      donorName: row.donorName,
      amount: row.amount,
      transferCode: row.transferCode,
      note: row.note,
      donorEmail: donorEmail?.trim() || null,
    };
  }

  private bankDisplay() {
    return {
      qrImageUrl: this.config.get<string>(
        'PAYMENT_QR_URL',
        '/images/payment-qr.webp',
      ),
      accountName: this.config.get<string>('PAYMENT_ACCOUNT_NAME', ''),
      accountNumber: this.config.get<string>('PAYMENT_ACCOUNT_NUMBER', ''),
      bankName: this.config.get<string>('PAYMENT_BANK_NAME', ''),
    };
  }

  private async generateUniqueTransferCode(): Promise<string> {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const transferCode = generateTransferCode();
      const [billingHit, fundHit] = await Promise.all([
        this.prisma.billingOrder.findUnique({ where: { transferCode } }),
        this.prisma.orgAppFundContribution.findUnique({
          where: { transferCode },
        }),
      ]);
      if (!billingHit && !fundHit) return transferCode;
    }
    throw new BadRequestException('Không thể tạo mã chuyển khoản, thử lại');
  }

  private serialize(row: {
    id: number;
    organizationId: number;
    personId: number | null;
    donorName: string;
    amount: number;
    note: string | null;
    createdByUserId: number | null;
    status: AppFundContributionStatus;
    transferCode: string | null;
    reviewedAt: Date | null;
    reviewNote: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: row.id,
      organizationId: row.organizationId,
      personId: row.personId,
      donorName: row.donorName,
      amount: row.amount,
      note: row.note,
      createdByUserId: row.createdByUserId,
      status: row.status,
      transferCode: row.transferCode,
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      reviewNote: row.reviewNote,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
