import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ClanDutyEntryDto {
  @IsInt()
  personId: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder?: number;

  /** Ceremony template ids gắn với vai trò «Chuẩn bị bài cúng». */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  ceremonyTemplateIds?: number[];
}

export class UpsertClanDutyYearDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ClanDutyEntryDto)
  entries: ClanDutyEntryDto[];
}
