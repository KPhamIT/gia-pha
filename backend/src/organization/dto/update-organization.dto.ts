import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  @Matches(/^\d{0,4}$/, { message: 'establishedYear must be 0–4 digits' })
  establishedYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  clanAddress?: string;

  /** Google Maps iframe src (Share → Embed a map → copy src). */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  clanMapEmbedUrl?: string;

  /** Vĩ độ từ đường (−90…90). null = xóa. */
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsNumber()
  @Min(-90)
  @Max(90)
  clanLat?: number | null;

  /** Kinh độ từ đường (−180…180). null = xóa. */
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsNumber()
  @Min(-180)
  @Max(180)
  clanLng?: number | null;
}
