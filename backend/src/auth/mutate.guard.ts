import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '../../generated/prisma/client.js';
import { canMutate } from './org-access.js';

@Injectable()
export class MutateGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = (await super.canActivate(context)) as boolean;
    if (!activated) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<{ user?: User }>();
    if (!canMutate(request.user)) {
      throw new ForbiddenException('Admin or system role required');
    }

    return true;
  }
}
