import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewAppFundDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNote?: string;
}
