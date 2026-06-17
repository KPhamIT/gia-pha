import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac, randomBytes } from 'crypto';

const ZALO_PERMISSION_URL = 'https://oauth.zaloapp.com/v4/permission';
const ZALO_TOKEN_URL = 'https://oauth.zaloapp.com/v4/access_token';
const ZALO_PROFILE_URL = 'https://graph.zalo.me/v2.0/me?fields=id,name,picture';

export const ZALO_OAUTH_COOKIE = 'zalo_oauth';
export const ZALO_OAUTH_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;

export type ZaloOAuthCookie = {
  state: string;
  codeVerifier: string;
};

export type ZaloProfile = {
  id: string;
  name: string;
  pictureUrl: string | null;
};

type ZaloTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: string | number;
  error?: number;
  error_name?: string;
  error_reason?: string;
  error_description?: string;
};

@Injectable()
export class ZaloOAuthService {
  constructor(private readonly config: ConfigService) {}

  createOAuthSession(): { url: string; cookie: ZaloOAuthCookie } {
    const appId = this.requireConfig('ZALO_APP_ID');
    const redirectUri = this.requireConfig('ZALO_REDIRECT_URI');
    const state = randomBytes(16).toString('hex');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

    const params = new URLSearchParams({
      app_id: appId,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      state,
    });

    return {
      url: `${ZALO_PERMISSION_URL}?${params.toString()}`,
      cookie: { state, codeVerifier },
    };
  }

  parseOAuthCookie(raw: string | undefined): ZaloOAuthCookie | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<ZaloOAuthCookie>;
      if (typeof parsed.state !== 'string' || typeof parsed.codeVerifier !== 'string') return null;
      return { state: parsed.state, codeVerifier: parsed.codeVerifier };
    } catch {
      return null;
    }
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<string> {
    const appId = this.requireConfig('ZALO_APP_ID');
    const appSecret = this.requireConfig('ZALO_APP_SECRET');

    const body = new URLSearchParams({
      app_id: appId,
      code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    });

    const response = await fetch(ZALO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        secret_key: appSecret,
      },
      body: body.toString(),
    });

    const raw = (await response.json()) as ZaloTokenResponse;
    if (!response.ok || !raw.access_token) {
      const reason = raw.error_description ?? raw.error_reason ?? 'Zalo token exchange failed';
      throw new UnauthorizedException(reason);
    }

    return raw.access_token;
  }

  async fetchProfile(accessToken: string): Promise<ZaloProfile> {
    const appSecret = this.requireConfig('ZALO_APP_SECRET');
    const appSecretProof = this.buildAppSecretProof(accessToken, appSecret);

    const response = await fetch(ZALO_PROFILE_URL, {
      headers: {
        access_token: accessToken,
        appsecret_proof: appSecretProof,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Zalo profile request failed');
    }

    const raw = (await response.json()) as {
      id?: string;
      name?: string;
      picture?: { data?: { url?: string } } | string;
      error?: number;
      message?: string;
    };

    if (!raw?.id) {
      throw new UnauthorizedException(raw.message ?? 'Zalo profile is missing id');
    }

    const pictureUrl =
      typeof raw.picture === 'string'
        ? raw.picture
        : (raw.picture?.data?.url ?? null);

    return {
      id: raw.id,
      name: raw.name ?? 'Zalo user',
      pictureUrl,
    };
  }

  getFrontendUrl(): string {
    return this.config.get<string>('FRONTEND_URL', 'http://localhost:3000').replace(/\/$/, '');
  }

  buildAppSecretProof(accessToken: string, appSecret: string): string {
    return createHmac('sha256', appSecret).update(accessToken).digest('hex');
  }

  private requireConfig(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new UnauthorizedException(`Missing configuration: ${key}`);
    }
    return value;
  }
}
