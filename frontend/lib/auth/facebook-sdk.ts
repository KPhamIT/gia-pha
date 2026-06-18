const FB_SDK_VERSION = 'v21.0';

export function getFacebookAppId(): string | null {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  return appId || null;
}

export function isZaloLoginEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ZALO_LOGIN === 'true';
}

export function initFacebookSdk(appId: string): void {
  window.FB?.init({
    appId,
    cookie: true,
    xfbml: true,
    version: FB_SDK_VERSION,
  });
}

export function requestFacebookAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }

    window.FB.login(
      (response) => {
        if (response.status === 'connected' && response.authResponse?.accessToken) {
          resolve(response.authResponse.accessToken);
          return;
        }
        reject(new Error('facebook_login_cancelled'));
      },
      { scope: 'email,public_profile' },
    );
  });
}
