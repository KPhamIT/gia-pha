import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { assertOrgAccess, isSystem } from '../auth/org-access.js';
import {
  APP_CONFIG_STANDARD_FEATURES_KEY,
  DEFAULT_STANDARD_FEATURES,
  allStandardFeaturesEnabled,
  mergeStandardFeatures,
  parseFeaturePatch,
  type StandardFeatures,
} from './standard-features.types.js';

export type StandardFeaturesConfig = {
  defaults: StandardFeatures;
  overrides: Partial<StandardFeatures>;
  effective: StandardFeatures;
};

export type FeatureUser = Pick<User, 'role' | 'organizationId'> & {
  id?: number;
};

@Injectable()
export class StandardFeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemDefaults(): Promise<StandardFeatures> {
    const row = await this.prisma.appConfig.findUnique({
      where: { key: APP_CONFIG_STANDARD_FEATURES_KEY },
    });
    return mergeStandardFeatures({}, parseFeaturePatch(row?.value));
  }

  async updateSystemDefaults(patch: unknown): Promise<StandardFeatures> {
    const current = await this.getSystemDefaults();
    const next = mergeStandardFeatures(current, parseFeaturePatch(patch));
    await this.prisma.appConfig.upsert({
      where: { key: APP_CONFIG_STANDARD_FEATURES_KEY },
      create: { key: APP_CONFIG_STANDARD_FEATURES_KEY, value: next },
      update: { value: next },
    });
    return next;
  }

  async getOrgConfig(
    organizationId: number,
    user: User,
  ): Promise<StandardFeaturesConfig> {
    await this.assertOrgReadable(organizationId, user);
    return this.buildOrgConfig(organizationId);
  }

  async updateOrgOverrides(
    organizationId: number,
    user: User,
    patch: unknown,
  ): Promise<StandardFeaturesConfig> {
    await this.assertOrgReadable(organizationId, user);
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const defaults = await this.getSystemDefaults();
    const currentOverrides = parseFeaturePatch(org.standardFeatures);
    const nextOverrides = { ...currentOverrides, ...parseFeaturePatch(patch) };

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { standardFeatures: nextOverrides },
    });

    return {
      defaults,
      overrides: nextOverrides,
      effective: mergeStandardFeatures(defaults, nextOverrides),
    };
  }

  async resolveForUser(
    user: FeatureUser | null | undefined,
  ): Promise<StandardFeatures> {
    if (!user) {
      return { ...DEFAULT_STANDARD_FEATURES };
    }
    if (user.role === UserRole.SYSTEM || user.role === UserRole.ADMIN) {
      return allStandardFeaturesEnabled();
    }

    const defaults = await this.getSystemDefaults();
    if (user.organizationId == null) {
      return mergeStandardFeatures(defaults);
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { standardFeatures: true },
    });
    return mergeStandardFeatures(
      defaults,
      parseFeaturePatch(org?.standardFeatures),
    );
  }

  private async buildOrgConfig(
    organizationId: number,
  ): Promise<StandardFeaturesConfig> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    const defaults = await this.getSystemDefaults();
    const overrides = parseFeaturePatch(org.standardFeatures);
    return {
      defaults,
      overrides,
      effective: mergeStandardFeatures(defaults, overrides),
    };
  }

  private async assertOrgReadable(
    organizationId: number,
    user: User,
  ): Promise<void> {
    if (isSystem(user)) return;
    if (user.role === UserRole.ADMIN) {
      assertOrgAccess(user, organizationId);
      return;
    }
    throw new NotFoundException('Organization not found');
  }
}
