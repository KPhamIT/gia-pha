import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '../../generated/prisma/client.js';
import { canMutate } from '../auth/org-access.js';
import { REQUIRE_FEATURE_KEY } from './require-feature.decorator.js';
import { StandardFeaturesService } from './standard-features.service.js';
import type { StandardFeatureKey } from './standard-features.types.js';

@Injectable()
export class FeatureMutateGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly standardFeaturesService: StandardFeaturesService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = (await super.canActivate(context)) as boolean;
    if (!activated) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<{ user?: User }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    // Tài khoản demo chỉ xem: chặn cứng mọi thao tác ghi (lưu/sửa/xóa) bất kể
    // feature flag, để dữ liệu DB không bao giờ bị thay đổi.
    if (user.isDemo) {
      throw new ForbiddenException('Demo account is read-only');
    }

    if (canMutate(user)) {
      return true;
    }

    const feature = this.reflector.get<StandardFeatureKey | undefined>(
      REQUIRE_FEATURE_KEY,
      context.getHandler(),
    );
    if (!feature) {
      throw new ForbiddenException('Admin or system role required');
    }

    const features = await this.standardFeaturesService.resolveForUser(user);
    if (!features[feature]) {
      throw new ForbiddenException('Feature not permitted');
    }

    return true;
  }
}
