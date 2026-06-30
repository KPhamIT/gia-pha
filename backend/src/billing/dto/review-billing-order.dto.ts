import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewBillingOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  paymentRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNote?: string;
}
