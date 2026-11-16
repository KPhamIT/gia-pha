import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateBlankBookOrderDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  clanName: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  establishedYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  clanAddress?: string;

  @IsInt()
  @Min(1)
  @Max(2000)
  pageCount: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  coverIndex?: number;

  /** Cần ít nhất email hoặc SĐT (kiểm tra thêm trong service). */
  @ValidateIf((o: CreateBlankBookOrderDto) => Boolean(o.contactEmail))
  @IsEmail()
  @MaxLength(254)
  contactEmail?: string;

  @ValidateIf((o: CreateBlankBookOrderDto) => Boolean(o.contactPhone))
  @IsString()
  @Matches(/^[0-9+().\s-]{8,20}$/)
  contactPhone?: string;
}
