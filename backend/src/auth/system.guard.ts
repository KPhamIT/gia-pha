import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, type User } from '../../generated/prisma/client.js';

@Injectable()
export class SystemGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activated = (await super.canActivate(context)) as boolean;
    if (!activated) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<{ user?: User }>();
    if (request.user?.role !== UserRole.SYSTEM) {
      throw new ForbiddenException('System role required');
    }

    return true;
  }
}
