import {
  IsBoolean,
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
  @IsDateString()
  deathDate?: string;

  @IsOptional()
  @IsBoolean()
  deceased?: boolean;

  @IsOptional()
  @IsString()
  birthPlace?: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  ethnicity?: string;

  @IsOptional()
  @IsString()
  achievements?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  organizationId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
