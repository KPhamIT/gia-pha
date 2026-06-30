import { IsEmail, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBillingOrderDto {
  @IsInt()
  organizationId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
