import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    if (process.env.ALLOW_PUBLIC_ACCESS === 'true') {
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
