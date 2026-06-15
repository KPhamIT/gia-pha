import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class ContributionEntryDto {
  @IsInt()
  @Min(1)
  personId: number;

  @IsInt()
  @Min(0)
  amountPaid: number;
}

export class SetContributionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContributionEntryDto)
  contributions: ContributionEntryDto[];
}
