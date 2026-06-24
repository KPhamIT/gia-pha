import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class SetDemoOrganizationDto {
  /** Org dùng làm dữ liệu demo; null để bỏ chọn. */
  @IsOptional()
  @IsInt()
  @IsPositive()
  organizationId?: number | null;
}
