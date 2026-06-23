import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { FacebookLoginDto } from './dto/facebook-login.dto.js';
import { PasswordLoginDto } from './dto/password-login.dto.js';
import { LinkPersonDto } from './dto/link-person.dto.js';
import {
  ZALO_OAUTH_COOKIE,
  ZALO_OAUTH_COOKIE_MAX_AGE_MS,
  ZaloOAuthService,
} from './zalo-oauth.service.js';
import { JwtRequiredGuard } from './jwt-required.guard.js';
import { JwtOptionalGuard } from './jwt-optional.guard.js';
import type { User } from '../../generated/prisma/client.js';

type RequestUser = User;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly zaloOAuthService: ZaloOAuthService,
  ) {}

  @Post('login')
  loginWithPassword(@Body() body: PasswordLoginDto) {
    return this.authService.loginWithPassword(body.username, body.password);
  }

  @Post('facebook')
  async loginWithFacebook(@Body() body: FacebookLoginDto) {
    return this.authService.loginWithFacebook(body.accessToken);
  }

  @Get('zalo')
  startZaloLogin(@Res() res: Response) {
    const { url, cookie } = this.zaloOAuthService.createOAuthSession();
    res.cookie(ZALO_OAUTH_COOKIE, JSON.stringify(cookie), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: ZALO_OAUTH_COOKIE_MAX_AGE_MS,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.redirect(url);
  }

  @Get('zalo/callback')
  async zaloCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Request() req: { cookies?: Record<string, string> },
    @Res() res: Response,
  ) {
    const frontendUrl = this.zaloOAuthService.getFrontendUrl();
    const redirectError = (message: string) =>
      res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(message)}`);

    if (error) {
      return redirectError(error);
    }

    if (!code || !state) {
      return redirectError('Thiếu mã xác thực từ Zalo');
    }

    const session = this.zaloOAuthService.parseOAuthCookie(
      req.cookies?.[ZALO_OAUTH_COOKIE],
    );
    res.clearCookie(ZALO_OAUTH_COOKIE);

    if (!session || session.state !== state) {
      return redirectError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }

    try {
      const zaloAccessToken = await this.zaloOAuthService.exchangeCodeForToken(
        code,
        session.codeVerifier,
      );
      const profile = await this.zaloOAuthService.fetchProfile(zaloAccessToken);
      const login = await this.authService.loginWithZaloProfile(profile);
      return res.redirect(
        `${frontendUrl}/auth/callback#token=${login.accessToken}`,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Đăng nhập Zalo thất bại';
      return redirectError(message);
    }
  }

  @Get('me')
  @UseGuards(JwtOptionalGuard)
  async me(@Request() req: { user?: RequestUser | null }) {
    if (!req.user) {
      return { user: null, person: null };
    }
    return this.authService.buildMeResponse(req.user);
  }

  @Patch('me/person')
  @UseGuards(JwtRequiredGuard)
  linkPerson(
    @Request() req: { user: RequestUser },
    @Body() body: LinkPersonDto,
  ) {
    return this.authService.linkPerson(req.user, body.personId ?? null);
  }
}
