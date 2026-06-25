import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  adminOrganizationId,
  assertOrgAccess,
  isSystem,
} from '../auth/org-access.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { RegisterOrganizationWithAdminDto } from './dto/register-organization-with-admin.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import {
  createOrgAccessToken,
  verifyOrgAccessToken,
} from './org-access-token.js';
import { createRootPersonForOrg } from './create-root-person.js';
import { AuthService } from '../auth/auth.service.js';

export type OrganizationPublicAccess = {
  accessToken: string;
  publicAccessUrl: string;
};

const APP_CONFIG_DEMO_ORG_KEY = 'demoOrganizationId';

const DEMO_ACCOUNT = {
  providerId: 'local:demo',
  username: 'demo',
  email: 'demo@local.dev',
  defaultPassword: '123',
} as const;

function parseDemoOrgId(value: unknown): number | null {
  const id =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : null;
  return id != null && Number.isInteger(id) && id > 0 ? id : null;
}

function defaultOrgBookFields() {
  return {
    clanAddress: 'Việt Nam',
    establishedYear: String(new Date().getFullYear()),
  };
}

function trimOptional(value: string | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async listForUser(user: User) {
    if (isSystem(user)) {
      const orgs = await this.prisma.organization.findMany({
        orderBy: { name: 'asc' },
      });
      return orgs.map((org) => this.withPublicAccess(org));
    }
    if (user.role === UserRole.ADMIN && user.organizationId != null) {
      const org = await this.prisma.organization.findUnique({
        where: { id: user.organizationId },
      });
      return org ? [this.withPublicAccess(org)] : [];
    }
    return this.prisma.organization.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateOrganizationDto) {
    const org = await this.prisma.$transaction(async (tx) => {
      const created = await tx.organization.create({
        data: { name: dto.name.trim(), ...defaultOrgBookFields() },
      });
      await createRootPersonForOrg(tx, created.id);
      return created;
    });
    return this.withPublicAccess(org);
  }

  /** Logged-in user without an org admin role creates a clan and becomes its admin. */
  async registerAsAdmin(user: User, dto: CreateOrganizationDto) {
    if (user.role === UserRole.SYSTEM) {
      throw new ForbiddenException(
        'Tài khoản hệ thống dùng bảng quản trị để tạo dòng họ',
      );
    }
    if (user.role === UserRole.ADMIN && user.organizationId != null) {
      throw new BadRequestException('Bạn đã là quản trị viên của một dòng họ');
    }
    if (user.isDemo) {
      throw new BadRequestException(
        'Tài khoản demo không thể dùng để tạo dòng họ. Vui lòng tạo tài khoản quản trị mới.',
      );
    }

    const name = dto.name.trim();
    const result = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name, ...defaultOrgBookFields() },
      });
      await createRootPersonForOrg(tx, org.id);
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { role: UserRole.ADMIN, organizationId: org.id },
      });
      return { org, updatedUser };
    });

    return {
      ...this.withPublicAccess(result.org),
      user: {
        id: result.updatedUser.id,
        role: result.updatedUser.role,
        organizationId: result.updatedUser.organizationId,
      },
    };
  }

  /** Public signup: new org + local admin account, returns JWT to sign in immediately. */
  async registerWithAdmin(dto: RegisterOrganizationWithAdminDto) {
    const name = dto.name.trim();
    const username = dto.username.trim();
    await this.assertUsernameAvailable(username);

    const passwordHash = await AuthService.hashPassword(dto.password);
    const email = dto.email?.trim() || null;

    const user = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name, ...defaultOrgBookFields() },
      });
      await createRootPersonForOrg(tx, org.id);
      return tx.user.create({
        data: {
          username,
          email,
          passwordHash,
          provider: 'local',
          providerId: `local:${username}`,
          role: UserRole.ADMIN,
          organizationId: org.id,
        },
      });
    });

    return this.authService.buildAuthResponse(user);
  }

  async update(id: number, user: User, dto: UpdateOrganizationDto) {
    await this.findAccessible(id, user);
    const org = await this.prisma.organization.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        ...(dto.establishedYear !== undefined && {
          establishedYear: trimOptional(dto.establishedYear),
        }),
        ...(dto.clanAddress !== undefined && {
          clanAddress: trimOptional(dto.clanAddress),
        }),
      },
    });
    return this.withPublicAccess(org);
  }

  async remove(id: number) {
    const personCount = await this.prisma.person.count({
      where: { organizationId: id },
    });
    if (personCount > 0) {
      throw new BadRequestException(
        'Cannot delete organization that still has members',
      );
    }
    return this.prisma.organization.delete({ where: { id } });
  }

  async findAccessible(id: number, user: User) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    assertOrgAccess(user, id);
    return org;
  }

  async resolveBookContext(
    user: User | null | undefined,
    orgAccessToken?: string,
  ) {
    const orgId = await this.resolveOrgIdForBookContext(user, orgAccessToken);
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return this.toBookContext(org);
  }

  /** Org được SYSTEM chọn làm dữ liệu demo công khai (hiển thị ở trang chủ). */
  async getDemoOrganizationId(): Promise<number | null> {
    const row = await this.prisma.appConfig.findUnique({
      where: { key: APP_CONFIG_DEMO_ORG_KEY },
    });
    return parseDemoOrgId(row?.value);
  }

  async getDemoContext() {
    const orgId = await this.getDemoOrganizationId();
    if (orgId == null) return null;
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) return null;
    return {
      id: org.id,
      name: org.name,
      establishedYear: org.establishedYear,
      clanAddress: org.clanAddress,
    };
  }

  async setDemoOrganization(organizationId: number | null) {
    if (organizationId == null) {
      await this.prisma.appConfig.deleteMany({
        where: { key: APP_CONFIG_DEMO_ORG_KEY },
      });
      await this.provisionDemoAccount(null);
      return null;
    }
    await this.prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
    });
    await this.prisma.appConfig.upsert({
      where: { key: APP_CONFIG_DEMO_ORG_KEY },
      create: { key: APP_CONFIG_DEMO_ORG_KEY, value: organizationId },
      update: { value: organizationId },
    });
    await this.provisionDemoAccount(organizationId);
    return this.getDemoContext();
  }

  /**
   * Đồng bộ tài khoản demo (chỉ xem) với org demo đang chọn.
   * - Có org: tạo/cập nhật user `demo` (mật khẩu mặc định `123`) thuộc org đó.
   * - Bỏ chọn (null): vô hiệu hoá tài khoản demo.
   */
  private async provisionDemoAccount(organizationId: number | null) {
    if (organizationId == null) {
      await this.prisma.user.updateMany({
        where: { providerId: DEMO_ACCOUNT.providerId },
        data: { isActive: false },
      });
      return;
    }

    const password =
      this.config.get<string>('DEMO_PASSWORD') ?? DEMO_ACCOUNT.defaultPassword;
    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.user.upsert({
      where: { providerId: DEMO_ACCOUNT.providerId },
      create: {
        provider: 'local',
        providerId: DEMO_ACCOUNT.providerId,
        username: DEMO_ACCOUNT.username,
        email: DEMO_ACCOUNT.email,
        passwordHash,
        role: UserRole.STANDARD,
        isDemo: true,
        isActive: true,
        organizationId,
      },
      update: {
        passwordHash,
        role: UserRole.STANDARD,
        isDemo: true,
        isActive: true,
        organizationId,
      },
    });
  }

  async resolvePublicByToken(token: string) {
    const orgId = this.decodeAccessToken(token);
    if (orgId == null) {
      throw new NotFoundException('Invalid organization link');
    }
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return {
      id: org.id,
      name: org.name,
      createdAt: org.createdAt.toISOString(),
      establishedYear: org.establishedYear,
      clanAddress: org.clanAddress,
      accessToken: token,
      publicAccessUrl: this.buildPublicAccessUrl(org.id),
    };
  }

  private toBookContext(org: {
    name: string;
    createdAt: Date;
    establishedYear: string | null;
    clanAddress: string | null;
  }) {
    return {
      name: org.name,
      createdAt: org.createdAt.toISOString(),
      establishedYear: org.establishedYear,
      clanAddress: org.clanAddress,
    };
  }

  private async resolveOrgIdForBookContext(
    user: User | null | undefined,
    orgAccessToken?: string,
  ): Promise<number> {
    if (orgAccessToken) {
      const orgId = this.decodeAccessToken(orgAccessToken);
      if (orgId != null) return orgId;
    }
    if (user?.organizationId != null) return user.organizationId;
    throw new NotFoundException('Organization not found');
  }

  async getAccessLinkForUser(user: User, organizationId?: number) {
    let orgId: number;
    if (isSystem(user)) {
      if (organizationId == null) {
        throw new BadRequestException('organizationId is required');
      }
      orgId = organizationId;
    } else if (user.role === UserRole.ADMIN) {
      orgId = adminOrganizationId(user);
      if (organizationId != null && organizationId !== orgId) {
        throw new ForbiddenException('Cannot access another organization');
      }
    } else {
      throw new ForbiddenException('Admin or system role required');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return {
      id: org.id,
      name: org.name,
      establishedYear: org.establishedYear,
      clanAddress: org.clanAddress,
      ...this.buildAccessFields(org.id),
    };
  }

  async resolveDefaultOrganizationId(
    user?: User | null,
    requestedOrgId?: number,
    orgAccessToken?: string,
  ): Promise<number> {
    if (user?.role === UserRole.SYSTEM) {
      if (requestedOrgId != null) {
        await this.prisma.organization.findUniqueOrThrow({
          where: { id: requestedOrgId },
        });
        return requestedOrgId;
      }
      return (await this.getOrCreateDefaultOrganization()).id;
    }

    if (user?.role === UserRole.ADMIN) {
      const orgId = adminOrganizationId(user);
      if (requestedOrgId != null && requestedOrgId !== orgId) {
        throw new BadRequestException('Cannot access another organization');
      }
      return orgId;
    }

    if (user?.organizationId != null) {
      return user.organizationId;
    }

    if (orgAccessToken) {
      const orgId = this.decodeAccessToken(orgAccessToken);
      if (orgId == null) {
        throw new BadRequestException('Invalid organization link');
      }
      await this.prisma.organization.findUniqueOrThrow({
        where: { id: orgId },
      });
      return orgId;
    }

    throw new ForbiddenException('Organization access link required');
  }

  withPublicAccess<T extends { id: number; name: string }>(org: T) {
    return { ...org, ...this.buildAccessFields(org.id) };
  }

  private buildAccessFields(orgId: number): OrganizationPublicAccess {
    const accessToken = createOrgAccessToken(orgId, this.accessSecret());
    return {
      accessToken,
      publicAccessUrl: this.buildPublicAccessUrl(orgId),
    };
  }

  private buildPublicAccessUrl(orgId: number): string {
    const base =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const token = createOrgAccessToken(orgId, this.accessSecret());
    return `${base}/join/${encodeURIComponent(token)}`;
  }

  private decodeAccessToken(token: string): number | null {
    return verifyOrgAccessToken(token, this.accessSecret());
  }

  private accessSecret(): string {
    return this.config.get<string>('JWT_SECRET', 'change-me');
  }

  private async assertUsernameAvailable(username: string): Promise<void> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { providerId: `local:${username}` }],
      },
    });
    if (existing) {
      throw new BadRequestException('Tên đăng nhập đã được sử dụng');
    }
  }

  private async getOrCreateDefaultOrganization() {
    const richest = await this.prisma.organization.findFirst({
      orderBy: { persons: { _count: 'desc' } },
      include: { _count: { select: { persons: true } } },
    });
    if (richest && richest._count.persons > 0) {
      return richest;
    }

    const defaultName = 'Family Tree';
    const existing = await this.prisma.organization.findFirst({
      where: { name: defaultName },
    });
    if (existing) return existing;
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.organization.create({
        data: { name: defaultName, ...defaultOrgBookFields() },
      });
      await createRootPersonForOrg(tx, created.id);
      return created;
    });
  }
}
