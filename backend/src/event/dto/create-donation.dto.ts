import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateDonationDto {
  @IsNotEmpty()
  @IsString()
  donorName: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  personId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
