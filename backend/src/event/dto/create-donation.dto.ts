import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export enum DonationKindDto {
  MONEY = 'MONEY',
  IN_KIND = 'IN_KIND',
}

export class CreateDonationDto {
  @IsNotEmpty()
  @IsString()
  donorName: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  personId?: number;

  @IsOptional()
  @IsEnum(DonationKindDto)
  kind?: DonationKindDto;

  @ValidateIf(
    (dto: CreateDonationDto) =>
      (dto.kind ?? DonationKindDto.MONEY) === DonationKindDto.MONEY,
  )
  @IsOptional()
  @IsInt()
  @Min(0)
  amount?: number;

  @ValidateIf((dto: CreateDonationDto) => dto.kind === DonationKindDto.IN_KIND)
  @IsNotEmpty()
  @IsString()
  itemDescription?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
