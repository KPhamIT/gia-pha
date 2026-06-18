import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  notificationDeathAnniversaryEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationEventEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationPostEnabled?: boolean;

  @IsOptional()
  @IsString()
  onesignalSubscriptionId?: string | null;
}
