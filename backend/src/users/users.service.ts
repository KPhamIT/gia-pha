import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { adminOrganizationId, isSystem } from '../auth/org-access.js';
import { AuthService } from '../auth/auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

type UserWithOrg = {
  id: number;
  email: string | null;
  username: string | null;
  provider: string;
  providerId: string;
  role: UserRole;
  organizationId: number | null;
  organization?: { id: number; name: string } | null;
  person?: { id: number; fullName: string } | null;
};

const userInclude = {
  organization: { select: { id: true, name: true } },
  person: { select: { id: true, fullName: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(actor: User): Promise<UserWithOrg[]> {
    const where = isSystem(actor)
      ? {}
      : { organizationId: adminOrganizationId(actor) };

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { id: 'asc' },
      include: userInclude,
    });
    return users.map((user) => this.serialize(user));
  }

  async createUser(dto: CreateUserDto, actor: User): Promise<UserWithOrg> {
    const payload = this.resolveCreatePayload(dto, actor);
    await this.assertUsernameAvailable(payload.username);
    await this.validateRoleAssignment(payload.role, payload.organizationId);

    const user = await this.prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        passwordHash: await AuthService.hashPassword(payload.password),
        provider: 'local',
        providerId: `local:${payload.username}`,
        role: payload.role,
        organizationId: payload.organizationId,
      },
      include: userInclude,
    });

    return this.serialize(user);
  }

  async updateUser(
    userId: number,
    dto: UpdateUserDto,
    actor: User,
  ): Promise<UserWithOrg> {
    const existing = await this.findManagedUser(userId, actor);
    const payload = this.resolveUpdatePayload(dto, existing, actor);

    await this.validateRoleAssignment(
      payload.role,
      payload.organizationId,
      userId,
    );

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: payload.role,
        organizationId: payload.organizationId,
        email: payload.email,
        ...(payload.password
          ? { passwordHash: await AuthService.hashPassword(payload.password) }
          : {}),
      },
      include: userInclude,
    });

    return this.serialize(user);
  }

  async removeUser(userId: number, actor: User): Promise<{ id: number }> {
    const existing = await this.findManagedUser(userId, actor);

    if (existing.id === actor.id) {
      throw new BadRequestException('Cannot delete your own account');
    }

    if (!isSystem(actor) && existing.role !== UserRole.STANDARD) {
      throw new ForbiddenException('Org admin can only delete standard users');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { id: userId };
  }

  private resolveCreatePayload(
    dto: CreateUserDto,
    actor: User,
  ): {
    username: string;
    email: string | null;
    password: string;
    role: UserRole;
    organizationId: number | null;
  } {
    const username = dto.username.trim();

    if (isSystem(actor)) {
      return {
        username,
        email: dto.email?.trim() || null,
        password: dto.password,
        role: dto.role,
        organizationId: dto.organizationId ?? null,
      };
    }

    if (dto.role !== UserRole.STANDARD) {
      throw new ForbiddenException('Org admin can only create standard users');
    }

    return {
      username,
      email: dto.email?.trim() || null,
      password: dto.password,
      role: UserRole.STANDARD,
      organizationId: adminOrganizationId(actor),
    };
  }

  private resolveUpdatePayload(
    dto: UpdateUserDto,
    existing: User,
    actor: User,
  ): {
    role: UserRole;
    organizationId: number | null;
    email: string | null | undefined;
    password?: string;
  } {
    if (isSystem(actor)) {
      const nextRole = dto.role ?? existing.role;
      const nextOrgId =
        dto.organizationId !== undefined
          ? dto.organizationId
          : existing.organizationId;
      return {
        role: nextRole,
        organizationId: nextOrgId,
        email: dto.email,
        password: dto.password,
      };
    }

    if (existing.organizationId !== adminOrganizationId(actor)) {
      throw new ForbiddenException('No access to this user');
    }

    if (existing.role === UserRole.ADMIN && existing.id === actor.id) {
      return {
        role: UserRole.ADMIN,
        organizationId: existing.organizationId,
        email: dto.email ?? existing.email,
        password: dto.password,
      };
    }

    if (existing.role !== UserRole.STANDARD) {
      throw new ForbiddenException('Org admin can only edit standard users');
    }

    if (dto.role != null && dto.role !== UserRole.STANDARD) {
      throw new ForbiddenException('Org admin can only assign standard role');
    }

    return {
      role: UserRole.STANDARD,
      organizationId: adminOrganizationId(actor),
      email: dto.email ?? existing.email,
      password: dto.password,
    };
  }

  private async findManagedUser(userId: number, actor: User): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (isSystem(actor)) {
      return user;
    }

    if (user.organizationId !== adminOrganizationId(actor)) {
      throw new ForbiddenException('No access to this user');
    }

    return user;
  }

  private async assertUsernameAvailable(username: string): Promise<void> {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { providerId: `local:${username}` }],
      },
    });
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
  }

  private async validateRoleAssignment(
    role: UserRole,
    organizationId: number | null,
    excludeUserId?: number,
  ): Promise<void> {
    if (role === UserRole.SYSTEM) {
      if (organizationId != null) {
        throw new BadRequestException(
          'System users cannot belong to an organization',
        );
      }
      return;
    }

    if (role === UserRole.ADMIN) {
      if (organizationId == null) {
        throw new BadRequestException('Admin must belong to an organization');
      }
      const otherAdmin = await this.prisma.user.findFirst({
        where: {
          organizationId,
          role: UserRole.ADMIN,
          ...(excludeUserId != null ? { id: { not: excludeUserId } } : {}),
        },
      });
      if (otherAdmin) {
        throw new BadRequestException('This organization already has an admin');
      }
      return;
    }

    if (role === UserRole.STANDARD && organizationId != null) {
      const org = await this.prisma.organization.findUnique({
        where: { id: organizationId },
      });
      if (!org) {
        throw new BadRequestException('Organization not found');
      }
    }
  }

  private serialize(user: {
    id: number;
    email: string | null;
    username: string | null;
    provider: string;
    providerId: string;
    role: UserRole;
    organizationId: number | null;
    organization?: { id: number; name: string } | null;
    person?: { id: number; fullName: string } | null;
  }): UserWithOrg {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      provider: user.provider,
      providerId: user.providerId,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization ?? null,
      person: user.person ?? null,
    };
  }
}
