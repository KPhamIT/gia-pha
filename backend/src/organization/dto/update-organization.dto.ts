import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
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
}
