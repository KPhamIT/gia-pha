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

  /** Gỡ subscription của thiết bị hiện tại (không xóa thiết bị khác). */
  @IsOptional()
  @IsString()
  removeOnesignalSubscriptionId?: string;
}
