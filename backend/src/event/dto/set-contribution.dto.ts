import { IsBoolean, IsInt, Min } from 'class-validator';

export class SetContributionDto {
  @IsInt()
  @Min(1)
  personId: number;

  @IsBoolean()
  paid: boolean;
}
