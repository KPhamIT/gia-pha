import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

@Injectable()
export class ResendMailService {
  private readonly logger = new Logger(ResendMailService.name);
  private client: Resend | null = null;

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.fromEmail);
  }

  async send(input: SendMailInput): Promise<{ ok: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      this.logger.warn('Resend chưa cấu hình — bỏ qua gửi email');
      return { ok: false, error: 'Resend not configured' };
    }

    const to = Array.isArray(input.to) ? input.to : [input.to];
    if (to.length === 0) {
      return { ok: false, error: 'No recipients' };
    }

    try {
      const { data, error } = await this.getClient().emails.send({
        from: this.fromEmail!,
        to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });

      if (error) {
        this.logger.error(`Resend error: ${error.message}`);
        return { ok: false, error: error.message };
      }

      return { ok: true, id: data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Resend request failed: ${message}`);
      return { ok: false, error: message };
    }
  }

  private getClient(): Resend {
    if (!this.client) {
      this.client = new Resend(this.apiKey);
    }
    return this.client;
  }

  private get apiKey(): string | undefined {
    return this.config.get<string>('RESEND_API_KEY')?.trim() || undefined;
  }

  private get fromEmail(): string | undefined {
    return this.config.get<string>('RESEND_FROM_EMAIL')?.trim() || undefined;
  }
}
