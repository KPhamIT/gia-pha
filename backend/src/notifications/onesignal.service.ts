import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SendNotificationInput = {
  subscriptionIds: string[];
  title: string;
  content: string;
  data?: Record<string, unknown>;
  url?: string;
};

type OneSignalResponse = {
  id?: string;
  errors?: unknown;
};

@Injectable()
export class OneSignalService {
  private readonly logger = new Logger(OneSignalService.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.appId && this.restApiKey);
  }

  async sendNotification(input: SendNotificationInput): Promise<{ ok: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      this.logger.warn('OneSignal is not configured — skipping push');
      return { ok: false, error: 'OneSignal not configured' };
    }

    if (input.subscriptionIds.length === 0) {
      return { ok: false, error: 'No subscription IDs' };
    }

    const body = {
      app_id: this.appId,
      include_subscription_ids: input.subscriptionIds,
      headings: { vi: input.title, en: input.title },
      contents: { vi: input.content, en: input.content },
      data: input.data ?? {},
      url: input.url,
    };

    try {
      const response = await fetch('https://api.onesignal.com/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Key ${this.restApiKey}`,
        },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as OneSignalResponse;

      if (!response.ok) {
        const error = JSON.stringify(payload.errors ?? payload);
        this.logger.error(`OneSignal error: ${error}`);
        return { ok: false, error };
      }

      return { ok: true, id: payload.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`OneSignal request failed: ${message}`);
      return { ok: false, error: message };
    }
  }

  private get appId(): string | undefined {
    return this.config.get<string>('ONESIGNAL_APP_ID');
  }

  private get restApiKey(): string | undefined {
    return this.config.get<string>('ONESIGNAL_REST_API_KEY');
  }
}
