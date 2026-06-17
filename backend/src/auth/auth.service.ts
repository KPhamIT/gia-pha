import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ZaloProfile } from './zalo-oauth.service.js';

interface FacebookProfile {
  id: string;
  email: string | null;
  name: string;
  pictureUrl: string | null;
}

type ProviderProfile = {
  provider: string;
  providerId: string;
  email: string | null;
  name: string;
  pictureUrl: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithFacebook(accessToken: string) {
    const profile = await this.fetchFacebookProfile(accessToken);
    return this.completeProviderLogin({
      provider: 'facebook',
      providerId: profile.id,
      email: profile.email,
      name: profile.name,
      pictureUrl: profile.pictureUrl,
    });
  }

  async loginWithZaloProfile(profile: ZaloProfile) {
    return this.completeProviderLogin({
      provider: 'zalo',
      providerId: profile.id,
      email: null,
      name: profile.name,
      pictureUrl: profile.pictureUrl,
    });
  }

  signAccessToken(user: { id: number; providerId: string; email: string | null }) {
    return this.jwtService.sign({
      sub: user.id,
      providerId: user.providerId,
      email: user.email,
    });
  }

  private async completeProviderLogin(profile: ProviderProfile) {
    const user = await this.prisma.user.upsert({
      where: { providerId: profile.providerId },
      update: { email: profile.email ?? undefined },
      create: {
        provider: profile.provider,
        providerId: profile.providerId,
        email: profile.email,
      },
    });

    const organization = await this.ensureDefaultOrganization();
    let person = await this.prisma.person.findUnique({
      where: { userId: user.id },
    });

    if (!person) {
      person = await this.prisma.person.create({
        data: {
          fullName: profile.name,
          gender: undefined,
          birthDate: undefined,
          avatar: profile.pictureUrl || undefined,
          organizationId: organization.id,
          userId: user.id,
        },
      });
    }

    return {
      accessToken: this.signAccessToken(user),
      user,
      person,
    };
  }

  private async fetchFacebookProfile(
    accessToken: string,
  ): Promise<FacebookProfile> {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException('Facebook token invalid');
    }

    const raw = (await response.json()) as {
      id?: string;
      email?: string;
      name?: string;
      picture?: { data?: { url?: string } };
    };

    if (!raw?.id) {
      throw new UnauthorizedException('Facebook profile is missing id');
    }

    return {
      id: raw.id,
      email: raw.email ?? null,
      name: raw.name ?? 'Facebook user',
      pictureUrl: raw.picture?.data?.url ?? null,
    };
  }

  private async ensureDefaultOrganization() {
    const defaultName = 'Family Tree';
    const existing = await this.prisma.organization.findFirst({
      where: { name: defaultName },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.organization.create({
      data: { name: defaultName },
    });
  }
}
