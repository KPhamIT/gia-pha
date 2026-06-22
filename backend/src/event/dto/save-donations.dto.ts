import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { CreateDonationDto } from './create-donation.dto.js';
import { UpdateDonationDto } from './update-donation.dto.js';

export class UpdateDonationEntryDto extends UpdateDonationDto {
  @IsInt()
  @Min(1)
  id: number;
}

export class SaveDonationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDonationDto)
  create: CreateDonationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDonationEntryDto)
  update: UpdateDonationEntryDto[];

  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  remove: number[];
}
