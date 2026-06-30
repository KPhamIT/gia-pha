import { IsString, MaxLength } from 'class-validator';

export class RejectBillingOrderDto {
  @IsString()
  @MaxLength(500)
  reviewNote!: string;
}
