import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Always requires a valid JWT (used for /auth/me). */
@Injectable()
export class JwtRequiredGuard extends AuthGuard('jwt') {}
