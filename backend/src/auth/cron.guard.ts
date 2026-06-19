import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/** Validates `Authorization: Bearer <CRON_SECRET>` for scheduled HTTP triggers. */
@Injectable()
export class CronGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const secret = this.config.get<string>('CRON_SECRET');
    if (!secret) {
      throw new UnauthorizedException('CRON_SECRET is not configured');
    }

    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${secret}`) {
      throw new UnauthorizedException('Invalid cron authorization');
    }

    return true;
  }
}
