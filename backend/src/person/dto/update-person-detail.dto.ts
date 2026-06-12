import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class GraveInfoDto {
  @IsOptional()
  @IsString()
  cemetery?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePersonDetailDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsDateString()
  deathDate?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  biography?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GraveInfoDto)
  graveInfo?: GraveInfoDto;
}
