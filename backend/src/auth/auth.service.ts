import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { assertPersonOrgAccess } from './person-org-access.js';
import { canMutate } from './org-access.js';
import { StandardFeaturesService } from '../standard-features/standard-features.service.js';
import type { ZaloProfile } from './zalo-oauth.service.js';

interface FacebookProfile {
  id: string;
  email: string | null;
}

type ProviderProfile = {
  provider: string;
  providerId: string;
  email: string | null;
};

type AuthUser = {
  id: number;
  email: string | null;
  username: string | null;
  provider: string;
  providerId: string;
  role: UserRole;
  organizationId: number | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly standardFeaturesService: StandardFeaturesService,
  ) {}

  async loginWithFacebook(accessToken: string) {
    const profile = await this.fetchFacebookProfile(accessToken);
    return this.completeProviderLogin({
      provider: 'facebook',
      providerId: profile.id,
      email: profile.email,
    });
  }

  async loginWithZaloProfile(profile: ZaloProfile) {
    return this.completeProviderLogin({
      provider: 'zalo',
      providerId: profile.id,
      email: null,
    });
  }

  async loginWithPassword(username: string, password: string) {
    const normalized = username.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: normalized }, { email: normalized }],
        provider: 'local',
      },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.buildAuthResponse(user);
  }

  async linkPerson(
    user: { id: number; role: UserRole; organizationId: number | null },
    personId: number | null | undefined,
  ) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    if (!canMutate(dbUser)) {
      const features =
        await this.standardFeaturesService.resolveForUser(dbUser);
      if (!features.linkAccount) {
        throw new ForbiddenException('Feature not permitted');
      }
    }

    if (personId == null) {
      await this.prisma.person.updateMany({
        where: { userId: user.id },
        data: { userId: null },
      });
      return this.buildMeResponse(dbUser);
    }

    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (dbUser.role === UserRole.ADMIN) {
      assertPersonOrgAccess(dbUser, person);
    }

    await this.prisma.$transaction([
      this.prisma.person.updateMany({
        where: { userId: user.id },
        data: { userId: null },
      }),
      this.prisma.person.update({
        where: { id: personId },
        data: { userId: user.id },
      }),
    ]);

    const refreshed = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    return this.buildMeResponse(refreshed);
  }

  signAccessToken(user: {
    id: number;
    providerId: string;
    email: string | null;
    role: UserRole;
  }) {
    return this.jwtService.sign({
      sub: user.id,
      providerId: user.providerId,
      email: user.email,
      role: user.role,
    });
  }

  async buildMeResponse(user: {
    id: number;
    email: string | null;
    username: string | null;
    provider: string;
    providerId: string;
    role: UserRole;
    organizationId: number | null;
  }) {
    const person = await this.prisma.person.findUnique({
      where: { userId: user.id },
    });
    const features = await this.standardFeaturesService.resolveForUser(user);
    return {
      user: this.serializeUser(user),
      person,
      features,
    };
  }

  private async completeProviderLogin(profile: ProviderProfile) {
    const user = await this.prisma.user.upsert({
      where: { providerId: profile.providerId },
      update: { email: profile.email ?? undefined },
      create: {
        provider: profile.provider,
        providerId: profile.providerId,
        email: profile.email,
        role: UserRole.STANDARD,
      },
    });

    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: {
    id: number;
    email: string | null;
    username: string | null;
    provider: string;
    providerId: string;
    role: UserRole;
    organizationId: number | null;
  }) {
    const me = await this.buildMeResponse(user);
    return {
      accessToken: this.signAccessToken(user),
      ...me,
    };
  }

  private serializeUser(user: {
    id: number;
    email: string | null;
    username: string | null;
    provider: string;
    providerId: string;
    role: UserRole;
    organizationId: number | null;
    person?: { id: number; fullName: string } | null;
  }): AuthUser & { person?: { id: number; fullName: string } | null } {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      provider: user.provider,
      providerId: user.providerId,
      role: user.role,
      organizationId: user.organizationId,
      person: user.person ?? undefined,
    };
  }

  private async fetchFacebookProfile(
    accessToken: string,
  ): Promise<FacebookProfile> {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,email&access_token=${accessToken}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException('Facebook token invalid');
    }

    const raw = (await response.json()) as {
      id?: string;
      email?: string;
    };

    if (!raw?.id) {
      throw new UnauthorizedException('Facebook profile is missing id');
    }

    return {
      id: raw.id,
      email: raw.email ?? null,
    };
  }

  static async hashPassword(password: string): Promise<string> {
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    return bcrypt.hash(password, 10);
  }
}
