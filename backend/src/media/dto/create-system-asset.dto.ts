import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const CATEGORIES = ['background', 'scroll', 'couplet', 'other'] as const;

export class CreateSystemAssetDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];
}
