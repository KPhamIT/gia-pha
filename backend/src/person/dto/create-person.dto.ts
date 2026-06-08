import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  generation?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  branch?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  organizationId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
